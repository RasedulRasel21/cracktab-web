"use client";

import { useActionState, useState } from "react";
import ConfirmButton from "../ConfirmButton";
import Modal from "../Modal";
import { createUser, deleteUser, resetPassword, type UserFormState } from "./actions";

const field =
  "h-11 w-full rounded-xl border border-line bg-black px-4 text-sm text-white outline-none transition-colors focus:border-accent";
const labelText = "text-xs font-medium uppercase tracking-[0.15em] text-muted";

const initial: UserFormState = { error: null };

/**
 * The generated password appears exactly once, here, after the account is
 * created. It is never stored in readable form, so if this panel is dismissed
 * the only route back is a reset.
 */
function PasswordNotice({ state }: { state: UserFormState }) {
  if (!state.password) return null;

  return (
    <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
      <p className="text-sm font-semibold text-accent">
        Password for {state.name}
      </p>
      <code className="mt-2 block break-all rounded-lg bg-black px-3 py-2 font-mono text-sm text-white">
        {state.password}
      </code>
      <p className="mt-2 text-xs leading-relaxed text-accent/80">
        Copy it now and send it to them. It is not stored anywhere and will not
        be shown again — losing it means resetting the password.
      </p>
    </div>
  );
}

export function NewUserForm() {
  const [state, action, pending] = useActionState(createUser, initial);

  return (
    <form action={action} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className={labelText}>Name</span>
        <input name="name" required placeholder="Rafiujjaman Rafi" className={field} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelText}>Email</span>
        <input name="email" type="email" required className={field} />
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
          placeholder="Optional — shown under their posts."
          className="w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
        />
      </label>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {state.error}
        </p>
      )}

      <PasswordNotice state={state} />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}

export function ResetPasswordButton({ userId, name }: { userId: string; name: string }) {
  const [state, action, pending] = useActionState(resetPassword, initial);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium uppercase tracking-wide text-muted transition-colors hover:text-accent"
      >
        Reset password
      </button>

      <Modal
        open={open}
        title={`Reset ${name}'s password?`}
        description="Their current password stops working immediately. The new one is shown once — you'll need to send it to them."
        onClose={() => setOpen(false)}
      >
        <form
          action={action}
          onSubmit={() => setOpen(false)}
          className="flex flex-wrap justify-end gap-3"
        >
          <input type="hidden" name="userId" value={userId} />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 items-center justify-center rounded-full border border-line px-5 font-display text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
          >
            Reset password
          </button>
        </form>
      </Modal>

      {state.password && (
        <code className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-xs text-accent">
          {state.password}
        </code>
      )}
      {state.error && <span className="text-xs text-red-300">{state.error}</span>}
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
