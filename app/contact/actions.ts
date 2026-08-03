"use server";

import { Resend } from "resend";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot — bots fill hidden fields; humans don't.
  if (((formData.get("website") as string) ?? "").trim()) {
    return { status: "success", message: "Thanks — we'll be in touch shortly." };
  }

  const get = (k: string) => ((formData.get(k) as string) ?? "").trim();
  const firstName = get("firstName");
  const lastName = get("lastName");
  const email = get("email");
  const company = get("company");
  const projectType = get("projectType");
  const budget = get("budget");
  const details = get("details");

  if (!firstName || !email || !details) {
    return {
      status: "error",
      message: "Please fill in your name, email, and project details.",
    };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] Missing RESEND_API_KEY env var");
    return {
      status: "error",
      message:
        "Email isn't configured yet. Please reach us directly at hello@cracktab.com.",
    };
  }

  const to = process.env.CONTACT_TO || "hello@cracktab.com";
  const from = process.env.CONTACT_FROM || "Cracktab Website <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New project inquiry — ${firstName} ${lastName}`.trim(),
      text: [
        `Name: ${firstName} ${lastName}`.trim(),
        `Email: ${email}`,
        `Company: ${company || "—"}`,
        `Project type: ${projectType || "—"}`,
        `Budget: ${budget || "—"}`,
        "",
        "Project details:",
        details,
      ].join("\n"),
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return {
        status: "error",
        message:
          "Something went wrong sending your message. Please try again or email hello@cracktab.com.",
      };
    }

    return {
      status: "success",
      message: "Thanks — your message is on its way. We'll be in touch shortly.",
    };
  } catch (err) {
    console.error("[contact] send failed:", err);
    return {
      status: "error",
      message:
        "Something went wrong. Please try again or email hello@cracktab.com.",
    };
  }
}
