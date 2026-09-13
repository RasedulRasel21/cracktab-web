"use client";

import { useId, useState } from "react";
import { MIN_LENGTH, validatePassword } from "../lib/passwords";

/**
 * Exactly 64 symbols, so a random 32-bit value modulo the length is free of
 * bias. Look-alikes (I, l, O, 0, 1) are left out — these get read off a screen.
 */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789-_!@#%+";

function generatePassword(length = 20): string {
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => ALPHABET[value % ALPHABET.length]).join("");
}

const field =
  "h-11 w-full rounded-xl border border-line bg-black px-4 font-mono text-sm text-white outline-none transition-colors focus:border-accent";
const labelText = "text-xs font-medium uppercase tracking-[0.15em] text-muted";

/**
 * A new-password field and its confirmation, with show/hide, a generator, and
 * live feedback against the same rules the server enforces.
 *
 * Submits as `password` and `confirm`. The live check is a convenience — the
 * server validates again, so nothing here is a security boundary.
 */
export default function PasswordFields({
  context,
  label = "Password",
}: {
  /** Refuses passwords built from the person's own name or email. */
  context?: { email?: string; name?: string };
  label?: string;
}) {
  const id = useId();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);

  const problem = password ? validatePassword(password, context) : null;
  const mismatch = confirm.length > 0 && confirm !== password;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {/* The buttons sit outside the <label>: a label wrapping several
            controls points at the first one, which would be "Show". */}
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={`${id}-password`} className={labelText}>
            {label}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setVisible((value) => !value)}
              className="text-xs font-medium text-muted transition-colors hover:text-accent"
            >
              {visible ? "Hide" : "Show"}
            </button>
            <button
              type="button"
              onClick={() => {
                const generated = generatePassword();
                setPassword(generated);
                setConfirm(generated);
                // Shown, so it can be copied before it's lost.
                setVisible(true);
              }}
              className="text-xs font-medium text-accent transition-colors hover:underline"
            >
              Generate
            </button>
          </div>
        </div>

        <input
          id={`${id}-password`}
          name="password"
          type={visible ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={MIN_LENGTH}
          required
          spellCheck={false}
          className={field}
        />

        <p aria-live="polite" className={`text-xs ${problem ? "text-amber-400" : "text-muted"}`}>
          {problem ??
            (password
              ? "Meets the rules."
              : `At least ${MIN_LENGTH} characters. Length matters more than symbols.`)}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-confirm`} className={labelText}>
          Confirm {label.toLowerCase()}
        </label>
        <input
          id={`${id}-confirm`}
          name="confirm"
          type={visible ? "text" : "password"}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
          required
          spellCheck={false}
          className={field}
        />
        {mismatch && <p className="text-xs text-red-300">The two don&apos;t match yet.</p>}
      </div>
    </div>
  );
}
