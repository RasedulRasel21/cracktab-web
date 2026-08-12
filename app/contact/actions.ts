"use server";

import nodemailer from "nodemailer";
import { resolveMx } from "node:dns/promises";
import disposableList from "disposable-email-domains/index.json";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- Layer A: spam signals -----------------------------------------------

// Pitch phrases these "greedy offer" spammers reuse. Multi-word on purpose so
// a real prospect saying "I need SEO help" doesn't trip it.
const SPAM_PHRASES = [
  "seo service",
  "improve your ranking",
  "improve your seo",
  "rank your website",
  "rank your site",
  "first page of google",
  "increase your traffic",
  "increase website traffic",
  "more traffic to your website",
  "guest post",
  "link building",
  "buy backlinks",
  "quality backlinks",
  "high quality backlinks",
  "web design services",
  "website design offer",
  "digital marketing services",
  "affordable price",
  "cheap price",
  "dear sir",
  "dear madam",
  "dear owner",
  "i visited your website",
  "i came across your website",
  "i found your website",
  "make money online",
  "email marketing services",
  "bulk email",
  "investment opportunity",
  "crypto",
  "bitcoin",
  "forex",
  "casino",
  "viagra",
  "loan offer",
];

// Disposable / throwaway email domains — the community list (120k+ domains)
// plus manual additions for fresh temp-mail domains not yet listed anywhere.
const DISPOSABLE = new Set<string>([
  ...(disposableList as string[]),
  "bora4d.com",
]);

// Trusted mailbox providers — always valid, skip the MX lookup entirely so a
// flaky DNS resolver can never false-flag a real gmail/outlook/etc. address.
const TRUSTED_PROVIDERS = new Set([
  "gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "hotmail.co.uk",
  "live.com", "msn.com", "yahoo.com", "yahoo.co.uk", "ymail.com", "icloud.com",
  "me.com", "mac.com", "proton.me", "protonmail.com", "aol.com", "gmx.com",
  "gmx.net", "zoho.com", "yandex.com", "fastmail.com",
]);

// "none" = domain definitively has no mail server; "unknown" = lookup failed
// (network/timeout) — we do NOT penalize "unknown" to avoid false positives.
async function domainMxStatus(domain: string): Promise<"ok" | "none" | "unknown"> {
  try {
    const mx = await Promise.race([
      resolveMx(domain),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("mx timeout")), 4000),
      ),
    ]);
    return Array.isArray(mx) && mx.length > 0 ? "ok" : "none";
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    // Only ENOTFOUND / ENODATA mean "no records"; everything else is unknown.
    return code === "ENOTFOUND" || code === "ENODATA" ? "none" : "unknown";
  }
}

async function spamScore(input: {
  email: string;
  message: string;
}): Promise<{ score: number; reasons: string[] }> {
  const reasons: string[] = [];
  let score = 0;
  const text = input.message.toLowerCase();

  // Pitch phrases (strong)
  for (const p of SPAM_PHRASES) {
    if (text.includes(p)) {
      score += 2;
      reasons.push(`phrase:${p}`);
    }
  }

  // Links — cold pitches almost always paste a URL. Single link is weak
  // (a real prospect may share their store); many links is strong.
  const links = (input.message.match(/https?:\/\/|www\./gi) || []).length;
  if (links >= 3) {
    score += 3;
    reasons.push(`links:${links}`);
  } else if (links >= 1) {
    score += 1;
    reasons.push(`links:${links}`);
  }

  // Very short / low-effort message
  if (input.message.trim().length < 15) {
    score += 2;
    reasons.push("short");
  }

  // All-caps shouting
  const letters = input.message.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 25 && letters === letters.toUpperCase()) {
    score += 1;
    reasons.push("caps");
  }

  // Email domain checks
  const domain = input.email.split("@")[1]?.toLowerCase() ?? "";
  if (DISPOSABLE.has(domain)) {
    score += 4;
    reasons.push("disposable");
  } else if (domain && !TRUSTED_PROVIDERS.has(domain)) {
    // Only penalize a domain that DEFINITIVELY has no mail server.
    if ((await domainMxStatus(domain)) === "none") {
      score += 3;
      reasons.push("no-mx");
    }
  }

  return { score, reasons };
}

// Thresholds
const DROP_AT = 6; // silently discard
const TAG_AT = 3; // deliver but flag the subject

// --------------------------------------------------------------------------

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot (bots) — humans don't fill hidden fields.
  if (((formData.get("website") as string) ?? "").trim()) {
    return { status: "success", message: "Thanks — we'll be in touch shortly." };
  }

  const get = (k: string) => ((formData.get(k) as string) ?? "").trim();
  const firstName = get("firstName");
  const lastName = get("lastName");
  const email = get("email");
  const company = get("company");
  const projectType = get("projectType");
  const details = get("details");

  // The country select carries "US +1"; keep just the dial code for the email.
  const dial = get("phoneCountry").split(" ")[1] ?? "";
  const phoneNumber = get("phone");
  const phone = phoneNumber ? `${dial} ${phoneNumber}`.trim() : "";

  if (!firstName || !email || !details) {
    return {
      status: "error",
      message: "Please fill in your name, email, and project details.",
    };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  // ---- Layer A + B: score, then drop / tag --------------------------------
  const { score, reasons } = await spamScore({ email, message: details });

  if (score >= DROP_AT) {
    // Silent drop — show the sender the normal success so they get no feedback.
    console.warn(`[contact] dropped spam (score ${score}): ${reasons.join(", ")} — ${email}`);
    return { status: "success", message: "Thanks — your message is on its way. We'll be in touch shortly." };
  }

  const flagged = score >= TAG_AT;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    CONTACT_TO,
    CONTACT_FROM,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("[contact] Missing SMTP env vars");
    return {
      status: "error",
      message: "Email isn't configured yet. Please reach us directly at hello@cracktab.com.",
    };
  }

  const port = Number(SMTP_PORT || 465);
  const to = CONTACT_TO || SMTP_USER;
  const from = CONTACT_FROM || `Cracktab Website <${SMTP_USER}>`;

  const subject =
    (flagged ? "[Possible Spam] " : "") +
    `New project inquiry — ${firstName} ${lastName}`.trim();

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text: [
        flagged ? `⚠️ Flagged as possible spam (score ${score}: ${reasons.join(", ")})` : "",
        flagged ? "" : "",
        `Name: ${firstName} ${lastName}`.trim(),
        `Email: ${email}`,
        `Phone: ${phone || "—"}`,
        `Company: ${company || "—"}`,
        `Project type: ${projectType || "—"}`,
        "",
        "Project details:",
        details,
      ]
        .filter((line, i) => !(line === "" && i < 2))
        .join("\n"),
    });

    return {
      status: "success",
      message: "Thanks — your message is on its way. We'll be in touch shortly.",
    };
  } catch (err) {
    console.error("[contact] send failed:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again or email hello@cracktab.com.",
    };
  }
}
