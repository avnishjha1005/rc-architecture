"use client";

import dynamic from "next/dynamic";

export const HostedChisel = dynamic(() => import("./ReviewWorkspace"), { ssr: false });

export const ChiselPreview = dynamic(
  async () => window.parent === window ? () => null : (await import("./PreviewBridge")).default,
  { ssr: false },
);
