export type FeedbackStatus = "open" | "resolved";

export type FeedbackPin = {
  id: string;
  number: number;
  status: FeedbackStatus;
  elementSelector: string;
  anchorX: number;
  anchorY: number;
  fallbackX: number;
  fallbackY: number;
};

export type FeedbackTarget = {
  pagePath: string;
  pageUrl: string;
  elementSelector: string;
  elementLabel: string;
  anchorX: number;
  anchorY: number;
  fallbackX: number;
  fallbackY: number;
  scrollY: number;
  viewportWidth: number;
  viewportHeight: number;
  breakpoint: string;
  browserContext: string;
};

export type FeedbackItem = FeedbackTarget & {
  id: string;
  status: FeedbackStatus;
  comment: string;
  reviewerName: string;
  reviewerId: string;
  screenshotUrl?: string;
  externalUrl?: string;
  createdAt: string;
  resolvedAt?: string;
};

export type FeedbackQuery = { pagePath: string; status?: FeedbackStatus };

export type CreateFeedbackInput = FeedbackTarget & {
  comment: string;
  reviewerName: string;
  reviewerId: string;
};

export interface FeedbackProvider {
  list(query: FeedbackQuery): Promise<FeedbackItem[]>;
  create(input: CreateFeedbackInput): Promise<FeedbackItem>;
  updateStatus(id: string, status: FeedbackStatus): Promise<FeedbackItem>;
  attachScreenshot(id: string, file: Blob): Promise<void>;
}

export interface FeedbackUiConfig {
  projectName: string;
  defaultPath: string;
  commentMaxLength: number;
  sessionDays: number;
  viewports: Record<string, number>;
  screenshot: {
    enabled: boolean;
    maxDimension: number;
    quality: number;
    maxBytes: number;
  };
}

export type FeedbackSession = {
  authenticated: true;
  reviewerId: string;
  reviewerName: string;
  expiresAt: number;
};

export type FeedbackClientMessage =
  | { type: "rc-feedback:ready"; path: string }
  | { type: "rc-feedback:navigate"; path: string }
  | { type: "rc-feedback:target"; target: FeedbackTarget }
  | { type: "rc-feedback:cancel" }
  | { type: "rc-feedback:pin-focus"; id: string }
  | { type: "rc-feedback:capture-result"; requestId: string; blob?: Blob; error?: string };

export type FeedbackHostMessage =
  | { type: "rc-feedback:state"; mode: "browse" | "comment"; pins: FeedbackPin[]; breakpoint: string }
  | { type: "rc-feedback:capture"; requestId: string; options: FeedbackUiConfig["screenshot"] }
  | { type: "rc-feedback:clear-target" };
