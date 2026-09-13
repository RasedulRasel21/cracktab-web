"use client";

import { useFormSubmit, useSuccessCount } from "../../components/useFormSubmit";
import PasswordFields from "../PasswordFields";
import { changeOwnPassword, updateProfile, type AccountState } from "./actions";

const field =
  "h-11 w-full rounded-xl border border-line bg-black px-4 text-sm text-white outline-none transition-colors focus:border-accent";
const labelText = "text-xs font-medium uppercase tracking-[0.15em] text-muted";

const initial: AccountState = { error: null };

function Notice({ state }: { state: AccountState }) {
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

export function ProfileForm({ name, bio }: { name: string; bio: string }) {
  const [state, onSubmit, pending] = useFormSubmit(updateProfile, initial);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className={labelText}>Name</span>
        <input name="name" required maxLength={120} defaultValue={name} className={field} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelText}>Bio</span>
        <textarea
          name="bio"
          rows={4}
          maxLength={600}
          defaultValue={bio}
          placeholder="A line or two about you, shown under your posts."
          className="w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
        />
      </label>

      <Notice state={state} />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

export function ChangePasswordForm({ email, name }: { email: string; name: string }) {
  const [state, onSubmit, pending] = useFormSubmit(changeOwnPassword, initial);
  // Cleared after a success, so no password lingers in the page; kept after an
  // error, so a typo in the confirmation doesn't mean starting over.
  const changed = useSuccessCount(state);

  return (
    <div className="flex flex-col gap-5">
      <Notice state={state} />

      <form key={changed} onSubmit={onSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className={labelText}>Current password</span>
          <input
            name="current"
            type="password"
            required
            autoComplete="current-password"
            className={field}
          />
        </label>

        <PasswordFields context={{ email, name }} label="New password" />

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
        >
          {pending ? "Changing…" : "Change password"}
        </button>
      </form>
    </div>
  );
}
