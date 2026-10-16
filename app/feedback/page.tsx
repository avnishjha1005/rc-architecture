import type { Metadata } from "next";
import { FeedbackWorkspace } from "@rc/website-feedback/client";
import { feedbackUiConfig } from "@/feedback.config";

export const metadata: Metadata = { title: "Website Review · RC Architecture", robots: { index: false, follow: false } };

export default function FeedbackPage() {
  return <FeedbackWorkspace config={feedbackUiConfig} />;
}
