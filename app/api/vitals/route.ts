const allowedMetrics = new Set(["CLS", "FCP", "FID", "INP", "LCP", "TTFB"]);

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") return Response.json({ error: "Invalid payload" }, { status: 400 });
  const metric = payload as Record<string, unknown>;
  if (typeof metric.name !== "string" || !allowedMetrics.has(metric.name) || typeof metric.value !== "number") {
    return Response.json({ error: "Invalid metric" }, { status: 400 });
  }

  const endpoint = process.env.ANALYTICS_ENDPOINT;
  if (endpoint) {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ANALYTICS_TOKEN ? { Authorization: `Bearer ${process.env.ANALYTICS_TOKEN}` } : {}),
      },
      body: JSON.stringify(metric),
    });
  }
  return new Response(null, { status: 204 });
}
