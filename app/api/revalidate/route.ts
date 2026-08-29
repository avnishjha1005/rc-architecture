import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const secret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { paths?: unknown } | null;
  const paths = Array.isArray(body?.paths)
    ? body.paths.filter((path): path is string => typeof path === "string" && path.startsWith("/")).slice(0, 20)
    : ["/", "/projects"];
  paths.forEach((path) => revalidatePath(path));
  return Response.json({ revalidated: paths, now: Date.now() });
}
