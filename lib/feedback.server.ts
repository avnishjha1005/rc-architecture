import { createGitHubProvider } from "@rc/website-feedback/providers/github";
import { createNotionProvider } from "@rc/website-feedback/providers/notion";
import { createFeedbackServer } from "@rc/website-feedback/server";
import { feedbackUiConfig } from "@/feedback.config";

const feedbackProvider = process.env.FEEDBACK_PROVIDER === "github"
  ? createGitHubProvider({
      token: process.env.GITHUB_TOKEN ?? "",
      repository: process.env.GITHUB_REPOSITORY ?? "",
      label: process.env.GITHUB_FEEDBACK_LABEL || "client-feedback",
    })
  : createNotionProvider({
    token: process.env.NOTION_API_TOKEN ?? "",
    dataSourceId: process.env.NOTION_FEEDBACK_DATA_SOURCE_ID ?? "",
    });

export const feedbackServer = createFeedbackServer({
  provider: feedbackProvider,
  auth: {
    password: process.env.FEEDBACK_ACCESS_PASSWORD ?? "",
    sessionSecret: process.env.FEEDBACK_SESSION_SECRET ?? "",
    sessionDays: feedbackUiConfig.sessionDays,
  },
  commentMaxLength: feedbackUiConfig.commentMaxLength,
  screenshotMaxBytes: feedbackUiConfig.screenshot.maxBytes,
});
