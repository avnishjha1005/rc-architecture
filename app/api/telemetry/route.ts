export async function POST(request: Request) {
  const endpoint = process.env.MONITORING_ENDPOINT;
  if (!endpoint) return new Response(null, { status: 204 });
  if (Number(request.headers.get("content-length") || 0) > 8_000) return Response.json({ error: "Payload too large" }, { status: 413 });

  const body = (await request.text()).slice(0, 8000);
  await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.MONITORING_TOKEN ? { Authorization: `Bearer ${process.env.MONITORING_TOKEN}` } : {}),
    },
    body,
  });
  return new Response(null, { status: 204 });
}
