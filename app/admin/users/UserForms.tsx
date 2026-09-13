"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormSubmit, useSuccessCount } from "../../components/useFormSubmit";
import ConfirmButton from "../ConfirmButton";
import Modal from "../Modal";
import PasswordFields from "../PasswordFields";
import { createUser, deleteUser, setUserPassword, type UserFormState } from "./actions";

const field =
  "h-11 w-full rounded-xl border border-line bg-black px-4 text-sm text-white outline-none transition-colors focus:border-accent";
const labelText = "text-xs font-medium uppercase tracking-[0.15em] text-muted";

const initial: UserFormState = { error: null };

function Notice({ state }: { state: UserFormState }) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p role="status" className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
        {state.success}
      </p>
    );
  }
  return null;
}

export function NewUserForm() {
  const router = useRouter();
  const [state, onSubmit, pending] = useFormSubmit(createUser, initial);
  const created = useSuccessCount(state);

  // The new person should appear in the list beside the form straight away.
  // Refresh once per success. Keyed on the result object itself: a refresh
  // re-renders this component, and an effect that simply checked
  // state.success re-fired on every one of those renders, so a single
  // success became an endless loop of full page re-renders.
  const refreshedFor = useRef<UserFormState | null>(null);
  useEffect(() => {
    if (!state.success || refreshedFor.current === state) return;
    refreshedFor.current = state;
    router.refresh();
  }, [state, router]);

  return (
    <div className="flex flex-col gap-5">
      <Notice state={state} />

      {/* Remounted after each success, so the fields — the password included —
          clear rather than sitting in the page. Never cleared on an error:
          fixing one field shouldn't mean retyping all of them. */}
      <form key={created} onSubmit={onSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className={labelText}>Name</span>
          <input name="name" required maxLength={120} placeholder="Rafiujjaman Rafi" className={field} />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelText}>Email</span>
          <input name="email" type="email" required maxLength={254} placeholder="name@example.com" className={field} />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelText}>Role</span>
          <select name="role" defaultValue="AUTHOR" className={field}>
            <option value="AUTHOR">Author — writes and manages their own posts</option>
            <option value="ADMIN">Admin — can edit anyone&apos;s posts and manage people</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelText}>Bio</span>
          <textarea
            name="bio"
            rows={3}
            maxLength={600}
            placeholder="Optional — shown under their posts."
            className="w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
          />
        </label>

        <PasswordFields />

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create account"}
        </button>
      </form>
    </div>
  );
}

/**
 * An admin sets someone's password. Replaces the old auto-generated reset: the
 * admin chooses it (or generates one in the field) and hands it over.
 */
export function SetPasswordButton({
  userId,
  name,
  email,
  isSelf,
}: {
  userId: string;
  name: string;
  email: string;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [state, onSubmit, pending] = useFormSubmit(setUserPassword, initial);

  // The action state current when the dialog opened; null while closed. A
  // different state object means this dialog's own submission has answered.
  const [openedWith, setOpenedWith] = useState<UserFormState | null>(null);
  const answered = openedWith !== null && state !== openedWith;
  const visible = openedWith !== null && !(answered && state.success);

  // Refresh once per success. Keyed on the result object itself: a refresh
  // re-renders this component, and an effect that simply checked
  // state.success re-fired on every one of those renders, so a single
  // success became an endless loop of full page re-renders.
  const refreshedFor = useRef<UserFormState | null>(null);
  useEffect(() => {
    if (!state.success || refreshedFor.current === state) return;
    refreshedFor.current = state;
    router.refresh();
  }, [state, router]);

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setOpenedWith(state)}
        className="text-xs font-medium uppercase tracking-wide text-muted transition-colors hover:text-accent"
      >
        {isSelf ? "Change password" : "Set password"}
      </button>

      <Modal
        open={visible}
        title={isSelf ? "Change your password" : `Set a new password for ${name}`}
        description={
          isSelf
            ? "Your other devices will be signed out. This one stays signed in."
            : `${name} will be signed out everywhere and will need the new password to get back in.`
        }
        onClose={() => setOpenedWith(null)}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="userId" value={userId} />
          <PasswordFields context={{ email, name }} label="New password" />

          {answered && state.error && (
            <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {state.error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpenedWith(null)}
              className="inline-flex h-10 items-center justify-center rounded-full border border-line px-5 font-display text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
            >
              {pending ? "Saving…" : "Set password"}
            </button>
          </div>
        </form>
      </Modal>

      {answered && state.success && (
        <span role="status" className="max-w-56 text-right text-xs text-accent">
          {state.success}
        </span>
      )}
    </div>
  );
}

export function DeleteUserButton({ userId, name }: { userId: string; name: string }) {
  return (
    <ConfirmButton
      action={deleteUser}
      hidden={{ userId }}
      label="Remove"
      title={`Remove ${name}'s account?`}
      description="They lose access immediately. This can't be undone."
      confirmLabel="Remove account"
    />
  );
}
