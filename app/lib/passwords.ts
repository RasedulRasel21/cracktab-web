/**
 * Password rules — one definition, used wherever a password is set, and safe
 * to import on the client for live feedback.
 *
 * Follows NIST SP 800-63B rather than the older composition rules. Length is
 * what makes a password hard to guess; "must contain a symbol" mostly produces
 * `Password1!`. So: a real minimum length, a ceiling at bcrypt's limit, and a
 * refusal of the passwords attackers try first.
 */

export const MIN_LENGTH = 12;

/**
 * bcrypt reads only the first 72 bytes of a password and silently ignores the
 * rest. Allowing longer would let someone set a 100-character password whose
 * last 28 characters are decoration — and never know. Bytes, not characters:
 * non-Latin text uses several bytes per character.
 */
export const MAX_BYTES = 72;

/** The first guesses in any credential-stuffing list, plus our own name. */
const COMMON = new Set([
  "password1234", "password12345", "password123456", "passwordpassword",
  "qwertyuiop12", "qwerty123456", "qwertyuiopas", "asdfghjkl123",
  "123456789012", "1234567890123", "abcdefghijkl", "abc123abc123",
  "letmein12345", "welcome12345", "iloveyou1234", "trustno11234",
  "admin1234567", "administrator", "changeme1234", "superman1234",
  "cracktab1234", "cracktab2025", "cracktab2026", "shopify12345",
]);

export function validatePassword(
  password: string,
  context: { email?: string | null; name?: string | null } = {},
): string | null {
  if (password.length < MIN_LENGTH) {
    return `Use at least ${MIN_LENGTH} characters.`;
  }

  if (new TextEncoder().encode(password).length > MAX_BYTES) {
    return `That's over ${MAX_BYTES} bytes — anything past that would be silently ignored. Shorten it.`;
  }

  if (/^(.)\1+$/.test(password)) {
    return "That's one character repeated.";
  }

  const lower = password.toLowerCase();

  if (COMMON.has(lower)) {
    return "That's one of the first passwords attackers try.";
  }

  const local = context.email?.split("@")[0]?.toLowerCase();
  if (local && local.length >= 4 && lower.includes(local)) {
    return "Don't build it from the email address.";
  }

  const firstName = context.name?.trim().split(/\s+/)[0]?.toLowerCase();
  if (firstName && firstName.length >= 4 && lower.includes(firstName)) {
    return "Don't build it from the person's name.";
  }

  return null;
}
