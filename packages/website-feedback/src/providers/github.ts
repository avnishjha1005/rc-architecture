import type { CreateFeedbackInput, FeedbackItem, FeedbackProvider, FeedbackQuery, FeedbackStatus } from "../types";

export type GitHubProviderConfig = {
  token: string;
  repository: string;
  label?: string;
};

type GitHubIssue = {
  number: number;
  state: "open" | "closed";
  body: string | null;
  created_at: string;
  closed_at: string | null;
  html_url: string;
  pull_request?: unknown;
};

const MARKER = "rc-website-feedback";

function repositoryParts(repository: string) {
  const [owner, name, ...extra] = repository.trim().split("/");
  if (!owner || !name || extra.length || !/^[a-zA-Z0-9_.-]+$/.test(owner) || !/^[a-zA-Z0-9_.-]+$/.test(name)) {
    throw new Error("GitHub feedback repository must use the owner/repository format.");
  }
  return `${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
}

function encodeMetadata(input: CreateFeedbackInput) {
  return Buffer.from(JSON.stringify(input), "utf8").toString("base64url");
}

function decodeMetadata(body: string | null): CreateFeedbackInput | null {
  const encoded = body?.match(new RegExp(`<!-- ${MARKER}:([A-Za-z0-9_-]+) -->`))?.[1];
  if (!encoded) return null;
  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<CreateFeedbackInput>;
    if (typeof parsed.comment !== "string" || typeof parsed.pagePath !== "string") return null;
    return parsed as CreateFeedbackInput;
  } catch {
    return null;
  }
}

function neutralizeMentions(value: string) {
  return value.replaceAll("@", "@\u200b");
}

function issueBody(input: CreateFeedbackInput) {
  const comment = neutralizeMentions(input.comment).split("\n").map((line) => `> ${line}`).join("\n");
  const selector = input.elementSelector.replaceAll("`", "\\`");
  return [
    "## Client feedback",
    "",
    comment,
    "",
    "## Context",
    "",
    `- Page: ${input.pagePath}`,
    `- Element: \`${selector}\` (${neutralizeMentions(input.elementLabel || "Page")})`,
    `- Viewport: ${input.viewportWidth} × ${input.viewportHeight} (${input.breakpoint})`,
    `- Scroll Y: ${input.scrollY}`,
    `- Reviewer: ${neutralizeMentions(input.reviewerName)}`,
    "",
    `<!-- ${MARKER}:${encodeMetadata(input)} -->`,
  ].join("\n");
}

function mapIssue(issue: GitHubIssue, input: CreateFeedbackInput): FeedbackItem {
  return {
    id: `github-${issue.number}`,
    status: issue.state === "closed" ? "resolved" : "open",
    ...input,
    externalUrl: issue.html_url,
    createdAt: issue.created_at,
    resolvedAt: issue.closed_at ?? undefined,
  };
}

export function createGitHubProvider(config: GitHubProviderConfig): FeedbackProvider {
  async function request(path: string, init: RequestInit = {}) {
    if (!config.token || !config.repository) throw new Error("GitHub feedback configuration is incomplete.");
    const repository = repositoryParts(config.repository);
    const response = await fetch(`https://api.github.com/repos/${repository}${path}`, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${config.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`GitHub ${response.status}: ${(await response.text()).slice(0, 500)}`);
    return response.json();
  }

  function issueNumber(id: string) {
    const match = /^github-(\d+)$/.exec(id);
    if (!match) throw new Error("Invalid GitHub feedback ID.");
    return match[1];
  }

  return {
    async list(query: FeedbackQuery) {
      const items: FeedbackItem[] = [];
      for (let page = 1; page <= 10; page += 1) {
        const params = new URLSearchParams({
          state: query.status === "open" ? "open" : query.status === "resolved" ? "closed" : "all",
          sort: "created",
          direction: "asc",
          per_page: "100",
          page: String(page),
        });
        if (config.label) params.set("labels", config.label);
        const issues = await request(`/issues?${params}`) as GitHubIssue[];
        for (const issue of issues) {
          if (issue.pull_request) continue;
          const metadata = decodeMetadata(issue.body);
          if (metadata?.pagePath === query.pagePath) items.push(mapIssue(issue, metadata));
        }
        if (issues.length < 100) break;
      }
      return items;
    },

    async create(input: CreateFeedbackInput) {
      const issue = await request("/issues", {
        method: "POST",
        body: JSON.stringify({
          title: `[Feedback] ${input.pagePath} · ${input.elementLabel || "Page"}`.slice(0, 256),
          body: issueBody(input),
          ...(config.label ? { labels: [config.label] } : {}),
        }),
      }) as GitHubIssue;
      return mapIssue(issue, input);
    },

    async updateStatus(id: string, status: FeedbackStatus) {
      const issue = await request(`/issues/${issueNumber(id)}`, {
        method: "PATCH",
        body: JSON.stringify(status === "resolved" ? { state: "closed", state_reason: "completed" } : { state: "open", state_reason: "reopened" }),
      }) as GitHubIssue;
      const metadata = decodeMetadata(issue.body);
      if (!metadata) throw new Error("GitHub issue does not contain website feedback metadata.");
      return mapIssue(issue, metadata);
    },

    async attachScreenshot() {
      throw new Error("GitHub Issues does not provide an API for binary screenshot attachments.");
    },
  };
}
