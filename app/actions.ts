"use server";

import { headers } from "next/headers";

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 4;
const attempts = new Map<string, number[]>();

function value(formData: FormData, key: string, maxLength: number) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim().slice(0, maxLength) : "";
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(input: string) {
  return input.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;",
  })[character] ?? character);
}

async function rateLimited(formName: string) {
  const requestHeaders = await headers();
  const address = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim()
    || requestHeaders.get("x-real-ip")
    || "unknown";
  const key = `${formName}:${address}`;
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
  if (attempts.size > 10_000) {
    const oldestKey = attempts.keys().next().value;
    if (oldestKey) attempts.delete(oldestKey);
  }
  return recent.length > MAX_REQUESTS;
}

async function deliver(subject: string, html: string, replyTo?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html, reply_to: replyTo }),
  });
  return response.ok;
}

export async function submitContact(_: FormState, formData: FormData): Promise<FormState> {
  if (value(formData, "website", 200)) return { status: "success", message: "Thank you. Your message has been sent." };
  if (await rateLimited("contact")) return { status: "error", message: "Too many attempts. Please try again in a few minutes." };

  const firstName = value(formData, "first-name", 80);
  const lastName = value(formData, "last-name", 80);
  const email = value(formData, "email", 254);
  const phone = value(formData, "phone", 50);
  const message = value(formData, "message", 5000);

  if (!firstName || !lastName || !validEmail(email) || !message) {
    return { status: "error", message: "Please complete the required fields with a valid email address." };
  }

  try {
    const delivered = await deliver(
      `Website enquiry from ${firstName} ${lastName}`,
      `<p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone || "Not supplied")}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      email,
    );
    return delivered
      ? { status: "success", message: "Thank you. Your message has been sent." }
      : { status: "error", message: "Messaging is temporarily unavailable. Please email us directly." };
  } catch (error) {
    console.error("Contact form delivery failed", error);
    return { status: "error", message: "We could not send your message. Please try again or email us directly." };
  }
}

export async function submitNewsletter(_: FormState, formData: FormData): Promise<FormState> {
  if (value(formData, "website", 200)) return { status: "success", message: "You’re subscribed." };
  if (await rateLimited("newsletter")) return { status: "error", message: "Too many attempts. Please try again in a few minutes." };

  const email = value(formData, "email", 254);
  if (!validEmail(email)) return { status: "error", message: "Enter a valid email address." };

  try {
    const delivered = await deliver(
      "New newsletter subscription",
      `<p>Please add <strong>${escapeHtml(email)}</strong> to the newsletter list.</p>`,
      email,
    );
    return delivered
      ? { status: "success", message: "You’re subscribed. Thank you." }
      : { status: "error", message: "Subscriptions are temporarily unavailable." };
  } catch (error) {
    console.error("Newsletter delivery failed", error);
    return { status: "error", message: "We could not subscribe you right now. Please try again." };
  }
}
