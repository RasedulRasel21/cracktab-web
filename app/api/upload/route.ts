import { NextResponse } from "next/server";
import { getVerifiedUser } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { upload, UploadError } from "../../lib/storage";

/**
 * Image upload for the editor — cover photos and inline body images.
 *
 * A route handler rather than a Server Action because the Tiptap toolbar needs
 * the resulting URL back synchronously to insert the node at the cursor.
 */
export async function POST(request: Request) {
  // The full check, not just the cookie signature: a deleted or disabled
  // account must not keep upload rights for the rest of its token's life.
  const user = await getVerifiedUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "body");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  try {
    const stored = await upload(file, folder === "covers" ? "covers" : "body");

    // Recorded so orphaned files are findable later, and so a media picker can
    // offer what's already uploaded instead of re-uploading the same photo.
    // A failure here must not lose the file the author just uploaded.
    try {
      await prisma.media.create({
        data: {
          url: stored.url,
          mimeType: stored.mimeType,
          sizeBytes: stored.sizeBytes,
          uploadedById: user.id,
        },
      });
    } catch (error) {
      console.error("[upload] stored the file but could not record it", error);
    }

    return NextResponse.json(stored);
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[upload] failed", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
