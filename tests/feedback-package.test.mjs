import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const rootManifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const packageManifest = JSON.parse(await readFile(new URL("../packages/website-feedback/package.json", import.meta.url), "utf8"));
const clientEntry = await readFile(new URL("../packages/website-feedback/src/client/index.ts", import.meta.url), "utf8");
const clientBridge = await readFile(new URL("../packages/website-feedback/src/client/FeedbackBridge.tsx", import.meta.url), "utf8");
const clientWorkspace = await readFile(new URL("../packages/website-feedback/src/client/FeedbackWorkspace.tsx", import.meta.url), "utf8");
const { createGitHubProvider } = await import("../packages/website-feedback/src/providers/github.ts");

test("feedback package is a private runtime workspace dependency", () => {
  assert.deepEqual(rootManifest.workspaces, ["packages/*"]);
  assert.equal(rootManifest.dependencies["@rc/website-feedback"], "*");
  assert.equal(packageManifest.private, true);
  assert.equal(packageManifest.dependencies.html2canvas, "^1.4.1");
  assert.match(packageManifest.peerDependencies.next, /16/);
  assert.match(packageManifest.peerDependencies.react, /19/);
});

test("feedback package exposes separate client and server boundaries", () => {
  assert.equal(packageManifest.exports["./client"], "./src/client/index.ts");
  assert.equal(packageManifest.exports["./server"], "./src/server/index.ts");
  assert.equal(packageManifest.exports["./providers/github"], "./src/providers/github.ts");
  assert.equal(packageManifest.exports["./providers/notion"], "./src/providers/notion.ts");
  assert.doesNotMatch(clientEntry, /server|notion|github/i);
});

test("feedback client source never reads deployment secrets", () => {
  for (const source of [clientBridge, clientWorkspace]) {
    assert.doesNotMatch(source, /process\.env|NOTION_API_TOKEN|GITHUB_TOKEN|FEEDBACK_SESSION_SECRET/);
  }
});

test("GitHub provider creates, lists, resolves, and reopens feedback issues", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  let issue;
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    calls.push({ url, init });
    if (init.method === "POST" && url.pathname.endsWith("/issues")) {
      const body = JSON.parse(String(init.body));
      issue = { number: 7, state: "open", body: body.body, created_at: "2026-01-01T00:00:00Z", closed_at: null, html_url: "https://github.com/rc/site/issues/7" };
      return Response.json(issue);
    }
    if (init.method === "PATCH") {
      const body = JSON.parse(String(init.body));
      issue = { ...issue, state: body.state, closed_at: body.state === "closed" ? "2026-01-02T00:00:00Z" : null };
      return Response.json(issue);
    }
    return Response.json([issue]);
  };

  try {
    const provider = createGitHubProvider({ token: "secret", repository: "rc/site", label: "client-feedback" });
    const input = {
      comment: "Increase the heading size",
      pagePath: "/projects",
      pageUrl: "https://example.com/projects",
      elementSelector: "main > h1",
      elementLabel: "Projects",
      anchorX: 0.5,
      anchorY: 0.5,
      fallbackX: 200,
      fallbackY: 100,
      scrollY: 0,
      viewportWidth: 1440,
      viewportHeight: 900,
      breakpoint: "desktop",
      browserContext: "test",
      reviewerName: "Reviewer",
      reviewerId: "reviewer-1",
    };
    const created = await provider.create(input);
    assert.equal(created.id, "github-7");
    assert.equal(created.externalUrl, "https://github.com/rc/site/issues/7");
    assert.equal((await provider.list({ pagePath: "/projects" }))[0].comment, input.comment);
    assert.equal((await provider.updateStatus(created.id, "resolved")).status, "resolved");
    assert.equal((await provider.updateStatus(created.id, "open")).status, "open");
    await assert.rejects(provider.attachScreenshot(created.id, new Blob()), /does not provide an API/);
    assert.ok(calls.every(({ init }) => new Headers(init.headers).get("Authorization") === "Bearer secret"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
