import type { FeedbackUiConfig } from "@rc/website-feedback/client";

export const feedbackUiConfig = {
  projectName: "RC Architecture",
  defaultPath: "/",
  commentMaxLength: 2000,
  sessionDays: 7,
  viewports: { desktop: 1440, tablet: 768, mobile: 390 },
  screenshot: {
    enabled: true,
    maxDimension: 1600,
    quality: 0.75,
    maxBytes: 4_500_000,
  },
} satisfies FeedbackUiConfig;
