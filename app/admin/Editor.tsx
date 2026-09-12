"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { TextAlign } from "@tiptap/extension-text-align";
import Modal from "./Modal";

/**
 * Post body editor.
 *
 * Tiptap (ProseMirror) rather than a contentEditable div: paste from Google
 * Docs or Word gets normalised against a schema instead of dumping foreign
 * markup into the page, and undo, nested lists and IME input work without us
 * writing any of it. The bundle only ever loads inside /admin, which is behind
 * a login and excluded in robots.txt, so none of it reaches a reader.
 *
 * The HTML is mirrored into a hidden input so the surrounding <form> posts it
 * through a plain Server Action — no client-side fetch on save.
 */

const MAX_DIMENSION = 1800;
const COMPRESS_QUALITY = 0.82;

/**
 * Phone cameras produce 4–8 MB images that no blog needs. Downscaling in the
 * browser keeps uploads fast on the slow connections these get written on, and
 * keeps the Blob store small.
 */
async function compress(file: File): Promise<File> {
  // GIFs are usually animated; re-encoding through a canvas kills the motion.
  if (file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));

  if (scale === 1 && file.size < 600_000) return file;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) return file;
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", COMPRESS_QUALITY),
  );

  if (!blob || blob.size >= file.size) return file;

  const stem = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${stem}.webp`, { type: "image/webp" });
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  const body = new FormData();
  body.append("file", await compress(file));
  body.append("folder", folder);

  const response = await fetch("/api/upload", { method: "POST", body });
  const data = await response.json();

  if (!response.ok) throw new Error(data.error ?? "Upload failed.");
  return data.url as string;
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-accent text-accent-ink"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

/** Icons that read at 16px — a paragraph pilcrow and stacked heading bars. */
function BlockIcon({ level }: { level: 0 | 1 | 2 | 3 | 4 | 5 | 6 }) {
  if (level === 0) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M13 4h5v2h-2v14h-2V6h-2v14h-2v-7a5 5 0 0 1 0-10h3Zm-3 2a3 3 0 0 0 0 6h1V6h-1Z" />
      </svg>
    );
  }
  // The bar height tracks the heading level, so the list reads as a hierarchy
  // at a glance rather than six near-identical rows.
  const height = 15 - level;
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <rect x="3" y={(24 - height) / 2} width="3" height={height} rx="1" />
      <rect x="8" y={(24 - height) / 2} width="3" height={height} rx="1" />
      <rect x="3" y="11" width="8" height="2.5" rx="1" />
      <text x="14" y="16.5" fontSize="10" fontWeight="700" fill="currentColor">
        {level}
      </text>
    </svg>
  );
}

function AlignIcon({ align }: { align: "left" | "center" | "right" }) {
  // Short bars offset to the side being aligned to — legible at 16px without
  // needing a label.
  const short = { left: "3", center: "6", right: "9" }[align];
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <rect x="3" y="5" width="18" height="2" rx="1" />
      <rect x={short} y="11" width="12" height="2" rx="1" />
      <rect x="3" y="17" width="18" height="2" rx="1" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M9.5 9.5V20" />
    </svg>
  );
}

const BLOCK_TYPES = [
  { level: 0 as const, label: "Paragraph" },
  { level: 1 as const, label: "Heading 1" },
  { level: 2 as const, label: "Heading 2" },
  { level: 3 as const, label: "Heading 3" },
  { level: 4 as const, label: "Heading 4" },
  { level: 5 as const, label: "Heading 5" },
  { level: 6 as const, label: "Heading 6" },
];

/**
 * Block-type picker, in the shape WordPress uses: one control showing what the
 * cursor is currently in, opening a list of everything it could become. Six
 * separate heading buttons would be a wall of near-identical toggles.
 */
function BlockTypeMenu({ editor }: { editor: TiptapEditor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current =
    BLOCK_TYPES.find(
      (type) => type.level > 0 && editor.isActive("heading", { level: type.level }),
    ) ?? BLOCK_TYPES[0];

  const apply = (level: number) => {
    const chain = editor.chain().focus();
    if (level === 0) chain.setParagraph().run();
    else chain.setNode("heading", { level }).run();
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <BlockIcon level={current.level} />
        <span className="min-w-20 text-left">{current.label}</span>
        <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true" fill="currentColor">
          <path d="M6 8.5 1.5 4h9L6 8.5Z" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-xl"
        >
          {BLOCK_TYPES.map((type) => (
            <li key={type.level}>
              <button
                type="button"
                role="option"
                aria-selected={type.level === current.level}
                onClick={() => apply(type.level)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-white/10 ${
                  type.level === current.level ? "text-accent" : "text-white/80"
                }`}
              >
                <BlockIcon level={type.level} />
                <span
                  className={
                    type.level === 0
                      ? ""
                      : type.level <= 2
                        ? "font-display font-semibold"
                        : "font-display"
                  }
                >
                  {type.label}
                </span>
                {type.level === 1 && (
                  <span className="ml-auto text-[0.65rem] uppercase tracking-wide text-muted">
                    title level
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Toolbar({ editor }: { editor: TiptapEditor }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The uploaded image waits here until its alt text is written, so a picture
  // can't be inserted with no description by dismissing the dialog.
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [altText, setAltText] = useState("");

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const insertImage = useCallback(async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      setPendingImage(await uploadImage(file, "body"));
      setAltText("");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }, []);

  const commitImage = useCallback(() => {
    if (!pendingImage) return;
    editor.chain().focus().setImage({ src: pendingImage, alt: altText }).run();
    setPendingImage(null);
    setAltText("");
  }, [editor, pendingImage, altText]);

  const openLink = useCallback(() => {
    setLinkUrl((editor.getAttributes("link").href as string | undefined) ?? "https://");
    setLinkOpen(true);
  }, [editor]);

  const commitLink = useCallback(() => {
    const chain = editor.chain().focus().extendMarkRange("link");
    if (linkUrl.trim() === "") chain.unsetLink().run();
    else chain.setLink({ href: linkUrl.trim() }).run();
    setLinkOpen(false);
  }, [editor, linkUrl]);

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-line p-2">
      {/* Block type first: it answers "what am I writing?" before the marks
          answer "how does this word look?" — and it matches Word and WordPress,
          which is where the muscle memory comes from. */}
      <BlockTypeMenu editor={editor} />

      <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />


      <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        &ldquo;
      </ToolbarButton>
      <ToolbarButton
        label="Code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        &lt;/&gt;
      </ToolbarButton>
      <ToolbarButton
        label="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        —
      </ToolbarButton>

      <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

      {(["left", "center", "right"] as const).map((align) => (
        <ToolbarButton
          key={align}
          label={`Align ${align}`}
          active={editor.isActive({ textAlign: align })}
          onClick={() => editor.chain().focus().setTextAlign(align).run()}
        >
          <AlignIcon align={align} />
        </ToolbarButton>
      ))}

      <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

      <ToolbarButton
        label="Insert table"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <TableIcon />
      </ToolbarButton>
      {editor.isActive("table") && (
        <>
          <ToolbarButton
            label="Add row"
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            +Row
          </ToolbarButton>
          <ToolbarButton
            label="Add column"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            +Col
          </ToolbarButton>
          <ToolbarButton
            label="Delete table"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            ✕Table
          </ToolbarButton>
        </>
      )}

      <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

      <ToolbarButton label="Link" active={editor.isActive("link")} onClick={openLink}>
        Link
      </ToolbarButton>
      <ToolbarButton label="Insert image" onClick={() => fileRef.current?.click()}>
        {busy ? "…" : "Image"}
      </ToolbarButton>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void insertImage(file);
          event.target.value = "";
        }}
      />

      <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

      <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
        ↶
      </ToolbarButton>
      <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
        ↷
      </ToolbarButton>

      {error && (
        <p role="alert" className="w-full px-1 pt-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <Modal
        open={pendingImage !== null}
        title="Describe this image"
        description="Read aloud by screen readers and used by search engines. Leave it empty only if the image is purely decorative."
        onClose={() => setPendingImage(null)}
      >
        <div className="flex flex-col gap-4">
          <input
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && commitImage()}
            placeholder="A developer reviewing Shopify theme code"
            className="h-11 w-full rounded-xl border border-line bg-black px-4 text-sm text-white outline-none transition-colors focus:border-accent"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setPendingImage(null)}
              className="inline-flex h-10 items-center justify-center rounded-full border border-line px-5 font-display text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={commitImage}
              className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
            >
              Insert image
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={linkOpen}
        title="Link"
        description="Clear the field and save to remove an existing link."
        onClose={() => setLinkOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <input
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && commitLink()}
            placeholder="https://example.com"
            className="h-11 w-full rounded-xl border border-line bg-black px-4 text-sm text-white outline-none transition-colors focus:border-accent"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setLinkOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-full border border-line px-5 font-display text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={commitLink}
              className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
            >
              Save link
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function Editor({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [html, setHtml] = useState(defaultValue);
  const [pasteError, setPasteError] = useState<string | null>(null);

  // editorProps is built before `useEditor` returns, so the handlers reach the
  // instance through a ref rather than closing over it.
  const editorRef = useRef<TiptapEditor | null>(null);

  const uploadAndInsert = useCallback(async (files: File[]) => {
    setPasteError(null);
    for (const file of files) {
      try {
        const url = await uploadImage(file, "body");
        editorRef.current?.chain().focus().setImage({ src: url, alt: "" }).run();
      } catch (error) {
        setPasteError(
          error instanceof Error ? error.message : "That image couldn't be uploaded.",
        );
      }
    }
  }, []);

  const editor = useEditor({
    // Required under the App Router: rendering on the server and again on the
    // client produces a hydration mismatch otherwise.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        link: { openOnClick: false },
      }),
      Image.configure({ inline: false }),
      TableKit.configure({ table: { resizable: true } }),
      // Alignment applies to block types that hold a line of text; there is no
      // sense aligning a list item or a table wrapper.
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: defaultValue,
    onUpdate: ({ editor: instance }) => setHtml(instance.getHTML()),
    editorProps: {
      attributes: {
        class: "prose min-h-[24rem] max-w-none px-5 py-4 focus:outline-none",
      },
      /**
       * Pasting or dragging an image uploads it and inserts the real URL.
       * Without this the browser drops a `blob:` or `data:` URI into the
       * document — it looks correct while editing and is broken for every
       * reader, which is the worst failure mode available.
       *
       * This cannot rescue an image copied out of Google Docs: that arrives as
       * a googleusercontent.com link rather than file data, so it comes through
       * as a URL that only loads for whoever copied it.
       */
      handlePaste: (_view, event) => {
        const images = Array.from(event.clipboardData?.files ?? []).filter((file) =>
          file.type.startsWith("image/"),
        );
        if (images.length === 0) return false;
        event.preventDefault();
        void uploadAndInsert(images);
        return true;
      },
      handleDrop: (_view, event) => {
        const images = Array.from(
          (event as DragEvent).dataTransfer?.files ?? [],
        ).filter((file) => file.type.startsWith("image/"));
        if (images.length === 0) return false;
        event.preventDefault();
        void uploadAndInsert(images);
        return true;
      },
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-black">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      {pasteError && (
        <p role="alert" className="border-t border-line px-5 py-2 text-xs text-red-300">
          {pasteError}
        </p>
      )}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
