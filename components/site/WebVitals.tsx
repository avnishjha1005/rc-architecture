"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS !== "true") return;
    const body = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      path: window.location.pathname,
    });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/vitals", body);
    else void fetch("/api/vitals", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
  });
  return null;
}
