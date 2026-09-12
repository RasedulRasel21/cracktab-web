"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = { error: null };

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <label className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          autoFocus
          className="h-12 rounded-xl border border-line bg-black px-4 text-sm text-white outline-none transition-colors focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
          Password
        </span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="h-12 rounded-xl border border-line bg-black px-4 text-sm text-white outline-none transition-colors focus:border-accent"
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

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
