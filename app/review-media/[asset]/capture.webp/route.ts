import { isSanityConfigured } from "@/sanity/env";
import { reviewImageSource } from "@/lib/review-media";

export async function GET(request: Request, { params }: { params: Promise<{ asset: string }> }) {
  const { asset } = await params;
  const width = new URL(request.url).searchParams.get("w");
  const url = reviewImageSource(asset, width === null ? undefined : Number(width));
  if (!isSanityConfigured || !url) return new Response(null, { status: 404 });
  const response = await fetch(url, { redirect: "manual" });
  if (!response.ok) {
    const headers = new Headers({ "Cache-Control": "no-store" });
    for (const name of ["Content-Type", "Retry-After"]) {
      const value = response.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(response.body, { status: response.status, headers });
  }
  if (response.headers.get("Content-Type")?.split(";")[0] !== "image/webp") {
    return new Response(null, { status: 502 });
  }
  return new Response(response.body, { headers: {
    "Content-Type": "image/webp",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  } });
}
