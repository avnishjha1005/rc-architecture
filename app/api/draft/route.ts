import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

const allowedPath = /^\/(?:$|about\/?$|contact\/?$|projects(?:\/[a-z0-9-]+)?\/?$)/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/";
  if (!process.env.SANITY_PREVIEW_SECRET || secret !== process.env.SANITY_PREVIEW_SECRET || !allowedPath.test(path)) {
    return new Response("Invalid preview request", { status: 401 });
  }
  if (!process.env.SANITY_API_READ_TOKEN) return new Response("Preview token is not configured", { status: 503 });

  const draft = await draftMode();
  draft.enable();
  redirect(path);
}
