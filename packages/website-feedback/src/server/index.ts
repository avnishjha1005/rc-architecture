import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { CreateFeedbackInput, FeedbackProvider, FeedbackSession, FeedbackStatus } from "../types";

export type { CreateFeedbackInput, FeedbackItem, FeedbackProvider, FeedbackQuery, FeedbackStatus } from "../types";

type ServerConfig = {
  provider: FeedbackProvider;
  auth: { password: string; sessionSecret: string; sessionDays?: number };
  commentMaxLength?: number;
  screenshotMaxBytes?: number;
};

const COOKIE = "rc_feedback_session";
const attempts = new Map<string, number[]>();

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function logFailure(context: string, error: unknown) {
  // Next's development error inspector currently crashes while formatting some
  // Error objects. Log a plain string so the provider response remains visible.
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`${context}: ${detail}`);
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeSession(session: FeedbackSession, secret: string) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

function decodeSession(token: string | undefined, secret: string): FeedbackSession | null {
  if (!token || !secret) return null;
  const [payload, supplied] = token.split(".");
  if (!payload || !supplied || !safeEqual(signature(payload, secret), supplied)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as FeedbackSession;
    if (!parsed.authenticated || !parsed.reviewerId || !parsed.reviewerName || parsed.expiresAt <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function rateLimited(request: NextRequest, action: string, limit: number) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const key = `${action}:${address}`;
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < 10 * 60 * 1000);
  recent.push(now);
  attempts.set(key, recent);
  if (attempts.size > 5000) attempts.delete(attempts.keys().next().value ?? "");
  return recent.length > limit;
}

function validPagePath(value: unknown): value is string {
  return typeof value === "string" && value.length <= 1000 && value.startsWith("/") && !value.startsWith("//")
    && !value.startsWith("/api") && !value.startsWith("/feedback") && !value.startsWith("/studio");
}

function finite(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function validateCreate(value: unknown, maxLength: number): Omit<CreateFeedbackInput, "reviewerId" | "reviewerName"> | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const comment = typeof input.comment === "string" ? input.comment.trim() : "";
  if (!comment || comment.length > maxLength || !validPagePath(input.pagePath)) return null;
  return {
    comment,
    pagePath: input.pagePath,
    pageUrl: typeof input.pageUrl === "string" ? input.pageUrl.slice(0, 2000) : "",
    elementSelector: typeof input.elementSelector === "string" ? input.elementSelector.slice(0, 2000) : "",
    elementLabel: typeof input.elementLabel === "string" ? input.elementLabel.slice(0, 500) : "Page",
    anchorX: Math.min(1, Math.max(0, finite(input.anchorX, 0.5))),
    anchorY: Math.min(1, Math.max(0, finite(input.anchorY, 0.5))),
    fallbackX: finite(input.fallbackX), fallbackY: finite(input.fallbackY), scrollY: Math.max(0, finite(input.scrollY)),
    viewportWidth: Math.max(0, finite(input.viewportWidth)), viewportHeight: Math.max(0, finite(input.viewportHeight)),
    breakpoint: typeof input.breakpoint === "string" ? input.breakpoint.slice(0, 80) : "desktop",
    browserContext: typeof input.browserContext === "string" ? input.browserContext.slice(0, 1000) : "",
  };
}

export function createFeedbackServer(config: ServerConfig) {
  const sessionDays = config.auth.sessionDays ?? 7;
  const maxComment = config.commentMaxLength ?? 2000;
  const maxScreenshot = config.screenshotMaxBytes ?? 4_500_000;

  function configured() { return Boolean(config.auth.password && config.auth.sessionSecret.length >= 32); }
  function session(request: NextRequest) { return decodeSession(request.cookies.get(COOKIE)?.value, config.auth.sessionSecret); }
  function authorize(request: NextRequest) {
    if (!configured()) return { response: json({ error: "Feedback is not configured." }, 503), session: null };
    const current = session(request);
    return current ? { response: null, session: current } : { response: json({ error: "Unauthorized" }, 401), session: null };
  }

  const sessionHandlers = {
    GET(request: NextRequest) {
      const current = session(request);
      return current ? json(current) : json({ authenticated: false }, 401);
    },
    async POST(request: NextRequest) {
      if (!configured()) return json({ error: "Feedback is not configured." }, 503);
      if (!sameOrigin(request)) return json({ error: "Invalid origin." }, 403);
      if (rateLimited(request, "login", 12)) return json({ error: "Too many attempts. Try again shortly." }, 429);
      const body = await request.json().catch(() => null) as { password?: unknown; reviewerName?: unknown } | null;
      const password = typeof body?.password === "string" ? body.password : "";
      const reviewerName = typeof body?.reviewerName === "string" ? body.reviewerName.trim().slice(0, 100) : "";
      if (!reviewerName || !safeEqual(password, config.auth.password)) return json({ error: "Incorrect passcode or missing name." }, 401);
      const expiresAt = Date.now() + sessionDays * 86_400_000;
      const current: FeedbackSession = { authenticated: true, reviewerId: randomUUID(), reviewerName, expiresAt };
      const response = json(current);
      response.cookies.set(COOKIE, encodeSession(current, config.auth.sessionSecret), {
        httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: sessionDays * 86_400,
      });
      return response;
    },
    DELETE(request: NextRequest) {
      if (!sameOrigin(request)) return json({ error: "Invalid origin." }, 403);
      const response = json({ authenticated: false });
      response.cookies.set(COOKIE, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
      return response;
    },
  };

  const feedbackHandlers = {
    async GET(request: NextRequest) {
      const auth = authorize(request);
      if (auth.response) return auth.response;
      const pagePath = request.nextUrl.searchParams.get("path");
      const status = request.nextUrl.searchParams.get("status");
      if (!validPagePath(pagePath) || (status && status !== "open" && status !== "resolved")) return json({ error: "Invalid query." }, 400);
      try {
        return json({ items: await config.provider.list({ pagePath, status: status as FeedbackStatus | undefined }) });
      } catch (error) {
        logFailure("Feedback list failed", error);
        return json({ error: "Feedback storage is unavailable." }, 502);
      }
    },
    async POST(request: NextRequest) {
      const auth = authorize(request);
      if (auth.response || !auth.session) return auth.response!;
      if (!sameOrigin(request)) return json({ error: "Invalid origin." }, 403);
      if (rateLimited(request, `create:${auth.session.reviewerId}`, 30)) return json({ error: "Too many comments. Try again shortly." }, 429);
      const form = await request.formData().catch(() => null);
      if (!form) return json({ error: "Invalid form data." }, 400);
      const raw = form.get("payload");
      let parsed: unknown = null;
      try { parsed = typeof raw === "string" ? JSON.parse(raw) : null; } catch { return json({ error: "Invalid feedback." }, 400); }
      const input = validateCreate(parsed, maxComment);
      if (!input) return json({ error: "Invalid feedback." }, 400);
      const screenshot = form.get("screenshot");
      if (screenshot instanceof File && (screenshot.size > maxScreenshot || !["image/jpeg", "image/png"].includes(screenshot.type))) {
        return json({ error: "Screenshot is too large or has an unsupported type." }, 400);
      }
      try {
        const item = await config.provider.create({ ...input, reviewerId: auth.session.reviewerId, reviewerName: auth.session.reviewerName });
        let warning: string | undefined;
        if (screenshot instanceof File && screenshot.size) {
          try { await config.provider.attachScreenshot(item.id, screenshot); }
          catch (error) { logFailure("Feedback screenshot upload failed", error); warning = "Comment saved, but the screenshot could not be attached."; }
        }
        return json({ item, warning }, 201);
      } catch (error) {
        logFailure("Feedback create failed", error);
        return json({ error: "Feedback could not be saved." }, 502);
      }
    },
  };

  const itemHandlers = {
    async PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
      const auth = authorize(request);
      if (auth.response) return auth.response;
      if (!sameOrigin(request)) return json({ error: "Invalid origin." }, 403);
      const { id } = await context.params;
      const body = await request.json().catch(() => null) as { status?: unknown } | null;
      if (!/^[a-zA-Z0-9_-]{1,120}$/.test(id) || (body?.status !== "open" && body?.status !== "resolved")) return json({ error: "Invalid update." }, 400);
      try { return json({ item: await config.provider.updateStatus(id, body.status) }); }
      catch (error) { logFailure("Feedback update failed", error); return json({ error: "Feedback could not be updated." }, 502); }
    },
  };

  return { session: sessionHandlers, feedback: feedbackHandlers, item: itemHandlers };
}
