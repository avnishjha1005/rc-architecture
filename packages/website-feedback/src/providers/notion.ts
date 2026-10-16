import type { CreateFeedbackInput, FeedbackItem, FeedbackProvider, FeedbackQuery, FeedbackStatus } from "../types";

type NotionProviderConfig = { token: string; dataSourceId: string; apiVersion?: string };
type NotionTextPart = { plain_text?: string; text?: { content?: string } };
type NotionProperty = {
  rich_text?: NotionTextPart[];
  title?: NotionTextPart[];
  number?: number;
  status?: { name?: string };
  select?: { name?: string };
  url?: string | null;
  files?: Array<{ file?: { url?: string }; external?: { url?: string } }>;
  date?: { start?: string } | null;
};
type NotionPage = { id: string; url?: string; created_time: string; properties: Record<string, NotionProperty> };

const P = {
  title: "Name", status: "Status", comment: "Comment", path: "Page Path", url: "Page URL",
  selector: "Element Selector", label: "Element Label", anchorX: "Anchor X", anchorY: "Anchor Y",
  fallbackX: "Fallback X", fallbackY: "Fallback Y", scrollY: "Scroll Y", viewportWidth: "Viewport Width",
  viewportHeight: "Viewport Height", breakpoint: "Breakpoint", reviewer: "Reviewer Name", reviewerId: "Reviewer ID",
  browser: "Browser Context", screenshot: "Screenshot", resolvedAt: "Resolved At",
} as const;

function text(value: string) { return { rich_text: [{ type: "text", text: { content: value } }] }; }
function title(value: string) { return { title: [{ type: "text", text: { content: value } }] }; }
function readText(property?: NotionProperty) { return (property?.rich_text ?? property?.title ?? []).map((part) => part.plain_text ?? part.text?.content ?? "").join(""); }
function readNumber(property?: NotionProperty) { return typeof property?.number === "number" ? property.number : 0; }

function mapPage(page: NotionPage): FeedbackItem {
  const p = page.properties;
  const rawStatus = p[P.status]?.status?.name ?? p[P.status]?.select?.name ?? "Open";
  const first = p[P.screenshot]?.files?.[0];
  return {
    id: page.id,
    status: String(rawStatus).toLowerCase() === "resolved" ? "resolved" : "open",
    comment: readText(p[P.comment]), pagePath: readText(p[P.path]), pageUrl: p[P.url]?.url ?? "",
    elementSelector: readText(p[P.selector]), elementLabel: readText(p[P.label]),
    anchorX: readNumber(p[P.anchorX]), anchorY: readNumber(p[P.anchorY]), fallbackX: readNumber(p[P.fallbackX]),
    fallbackY: readNumber(p[P.fallbackY]), scrollY: readNumber(p[P.scrollY]), viewportWidth: readNumber(p[P.viewportWidth]),
    viewportHeight: readNumber(p[P.viewportHeight]), breakpoint: p[P.breakpoint]?.select?.name ?? "desktop",
    reviewerName: readText(p[P.reviewer]), reviewerId: readText(p[P.reviewerId]), browserContext: readText(p[P.browser]),
    screenshotUrl: first?.file?.url ?? first?.external?.url, createdAt: page.created_time,
    externalUrl: page.url,
    resolvedAt: p[P.resolvedAt]?.date?.start ?? undefined,
  };
}

export function createNotionProvider(config: NotionProviderConfig): FeedbackProvider {
  const version = config.apiVersion ?? "2026-03-11";

  async function request(path: string, init: RequestInit = {}) {
    if (!config.token || !config.dataSourceId) throw new Error("Notion feedback configuration is incomplete.");
    const response = await fetch(`https://api.notion.com/v1${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Notion-Version": version,
        ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...init.headers,
      },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Notion ${response.status}: ${(await response.text()).slice(0, 500)}`);
    return response.json();
  }

  async function retrieve(id: string) { return mapPage(await request(`/pages/${id}`) as NotionPage); }

  return {
    async list(query: FeedbackQuery) {
      const filters: Array<Record<string, unknown>> = [{ property: P.path, rich_text: { equals: query.pagePath } }];
      if (query.status) filters.push({ property: P.status, status: { equals: query.status === "open" ? "Open" : "Resolved" } });
      const data = await request(`/data_sources/${config.dataSourceId}/query`, {
        method: "POST",
        body: JSON.stringify({
          filter: filters.length === 1 ? filters[0] : { and: filters },
          sorts: [{ timestamp: "created_time", direction: "ascending" }],
          page_size: 100,
        }),
      }) as { results?: NotionPage[] };
      return (data.results ?? []).map(mapPage);
    },
    async create(input: CreateFeedbackInput) {
      const name = `${input.pagePath} · ${input.elementLabel || "Page"}`.slice(0, 200);
      const data = await request("/pages", {
        method: "POST",
        body: JSON.stringify({
          parent: { type: "data_source_id", data_source_id: config.dataSourceId },
          properties: {
            [P.title]: title(name), [P.status]: { status: { name: "Open" } }, [P.comment]: text(input.comment),
            [P.path]: text(input.pagePath), [P.url]: { url: input.pageUrl || null }, [P.selector]: text(input.elementSelector),
            [P.label]: text(input.elementLabel), [P.anchorX]: { number: input.anchorX }, [P.anchorY]: { number: input.anchorY },
            [P.fallbackX]: { number: input.fallbackX }, [P.fallbackY]: { number: input.fallbackY }, [P.scrollY]: { number: input.scrollY },
            [P.viewportWidth]: { number: input.viewportWidth }, [P.viewportHeight]: { number: input.viewportHeight },
            [P.breakpoint]: { select: { name: input.breakpoint } }, [P.reviewer]: text(input.reviewerName),
            [P.reviewerId]: text(input.reviewerId), [P.browser]: text(input.browserContext),
          },
        }),
      }) as NotionPage;
      return mapPage(data);
    },
    async updateStatus(id: string, status: FeedbackStatus) {
      await request(`/pages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ properties: {
          [P.status]: { status: { name: status === "open" ? "Open" : "Resolved" } },
          [P.resolvedAt]: { date: status === "resolved" ? { start: new Date().toISOString() } : null },
        } }),
      });
      return retrieve(id);
    },
    async attachScreenshot(id: string, file: Blob) {
      const filename = `feedback-${id}.jpg`;
      const upload = await request("/file_uploads", {
        method: "POST", body: JSON.stringify({ filename, content_type: file.type || "image/jpeg" }),
      }) as { id: string };
      const form = new FormData();
      form.append("file", file, filename);
      await request(`/file_uploads/${upload.id}/send`, { method: "POST", body: form });
      await request(`/pages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ properties: {
          [P.screenshot]: { files: [{ type: "file_upload", file_upload: { id: upload.id }, name: filename }] },
        } }),
      });
    },
  };
}
