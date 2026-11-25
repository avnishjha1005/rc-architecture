"use client";

import dynamic from "next/dynamic";

export const FeedbackPreview = dynamic(async () => {
  if (window.parent === window || new URLSearchParams(window.location.search).get("__feedback") !== "1") return () => null;
  return (await import("./FeedbackBridge")).FeedbackBridge;
}, { ssr: false });
