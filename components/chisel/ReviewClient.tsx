"use client";

import dynamic from "next/dynamic";

export const HostedChisel = dynamic(() => import("./HostedWorkspace"), { ssr: false });
export const ChiselPreview = dynamic(async () => window.parent === window ? () => null : (await import("./PreviewBridge")).default, { ssr: false });
