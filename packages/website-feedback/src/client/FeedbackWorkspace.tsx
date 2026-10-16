"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  FeedbackClientMessage,
  FeedbackHostMessage,
  FeedbackItem,
  FeedbackPin,
  FeedbackSession,
  FeedbackStatus,
  FeedbackTarget,
  FeedbackUiConfig,
} from "../types";
import styles from "./FeedbackWorkspace.module.css";

type Props = { config: FeedbackUiConfig };
type Filter = "all" | FeedbackStatus;

function cleanPath(input: string, fallback: string) {
  try {
    const url = new URL(input, window.location.origin);
    if (url.origin !== window.location.origin || ["/feedback", "/studio"].some((prefix) => url.pathname.startsWith(prefix))) return fallback;
    url.searchParams.delete("__feedback");
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch { return fallback; }
}

function previewUrl(path: string) {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("__feedback", "1");
  return `${url.pathname}${url.search}${url.hash}`;
}

function message(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function FeedbackWorkspace({ config }: Props) {
  const [session, setSession] = useState<FeedbackSession | null | undefined>(undefined);
  const [path, setPath] = useState(config.defaultPath);
  const [breakpoint, setBreakpoint] = useState(Object.keys(config.viewports)[0] || "desktop");
  const [mode, setMode] = useState<"browse" | "comment">("browse");
  const [filter, setFilter] = useState<Filter>("open");
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [target, setTarget] = useState<FeedbackTarget | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const captures = useRef(new Map<string, (result: { blob?: Blob; error?: string }) => void>());

  const visibleItems = useMemo(() => filter === "all" ? items : items.filter((item) => item.status === filter), [filter, items]);
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const pins: FeedbackPin[] = visibleItems.map((item, index) => ({
    id: item.id, number: index + 1, status: item.status, elementSelector: item.elementSelector,
    anchorX: item.anchorX, anchorY: item.anchorY, fallbackX: item.fallbackX, fallbackY: item.fallbackY,
  }));

  const sendToFrame = useCallback((payload: FeedbackHostMessage) => {
    iframeRef.current?.contentWindow?.postMessage(payload, window.location.origin);
  }, []);

  const loadItems = useCallback(async (currentPath = path) => {
    if (!session) return;
    const response = await fetch(`/api/feedback?path=${encodeURIComponent(currentPath)}`, { cache: "no-store" });
    if (response.status === 401) { setSession(null); return; }
    const data = await response.json() as { items?: FeedbackItem[]; error?: string };
    if (!response.ok) throw new Error(data.error || "Could not load feedback.");
    setItems(data.items ?? []);
  }, [path, session]);

  useEffect(() => {
    fetch("/api/feedback/session", { cache: "no-store" })
      .then(async (response) => response.ok ? setSession(await response.json() as FeedbackSession) : setSession(null))
      .catch(() => setSession(null));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { loadItems().catch((error) => setNotice(message(error, "Could not load feedback."))); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadItems]);

  useEffect(() => {
    if (!session) return;
    const refresh = () => { if (!document.hidden) loadItems().catch(() => undefined); };
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, [loadItems, session]);

  useEffect(() => { sendToFrame({ type: "rc-feedback:state", mode, pins, breakpoint }); }, [breakpoint, mode, pins, sendToFrame]);

  useEffect(() => {
    function receive(event: MessageEvent<FeedbackClientMessage>) {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data;
      if (data.type === "rc-feedback:ready") {
        sendToFrame({ type: "rc-feedback:state", mode, pins, breakpoint });
      } else if (data.type === "rc-feedback:navigate") {
        const next = cleanPath(data.path, path); setPath(next); setTarget(null); setSelectedId(null); setMode("browse");
      } else if (data.type === "rc-feedback:target") {
        setTarget(data.target); setSelectedId(null);
      } else if (data.type === "rc-feedback:cancel") {
        setTarget(null); setMode("browse");
      } else if (data.type === "rc-feedback:pin-focus") {
        setSelectedId(data.id); setTarget(null);
      } else if (data.type === "rc-feedback:capture-result") {
        captures.current.get(data.requestId)?.({ blob: data.blob, error: data.error }); captures.current.delete(data.requestId);
      }
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [breakpoint, mode, path, pins, sendToFrame]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/feedback/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reviewerName: form.get("name"), password: form.get("password") }) });
      const data = await response.json() as FeedbackSession & { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not sign in.");
      setSession(data);
    } catch (error) { setNotice(message(error, "Could not sign in.")); }
    finally { setLoading(false); }
  }

  async function logout() {
    await fetch("/api/feedback/session", { method: "DELETE" }); setSession(null); setItems([]);
  }

  function requestCapture() {
    if (!config.screenshot.enabled) return Promise.resolve<{ blob?: Blob; warning?: string }>({});
    const requestId = crypto.randomUUID();
    return new Promise<{ blob?: Blob; warning?: string }>((resolve) => {
      const timer = window.setTimeout(() => { captures.current.delete(requestId); resolve({ warning: "Comment saved, but screenshot capture timed out." }); }, 8000);
      captures.current.set(requestId, ({ blob, error }) => {
        window.clearTimeout(timer);
        resolve(blob ? { blob } : { warning: `Comment saved, but the screenshot could not be captured${error ? `: ${error}` : "."}` });
      });
      sendToFrame({ type: "rc-feedback:capture", requestId, options: config.screenshot });
    });
  }

  function pageTarget(): FeedbackTarget {
    const width = config.viewports[breakpoint] ?? window.innerWidth;
    return { pagePath: path, pageUrl: `${window.location.origin}${path}`, elementSelector: "body", elementLabel: "Whole page", anchorX: .5, anchorY: .12, fallbackX: width / 2, fallbackY: 80, scrollY: 0, viewportWidth: width, viewportHeight: iframeRef.current?.clientHeight ?? window.innerHeight, breakpoint, browserContext: navigator.userAgent };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!target) return;
    setLoading(true); setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const capture = await requestCapture();
      const body = new FormData(); body.set("payload", JSON.stringify({ ...target, comment: form.get("comment") }));
      if (capture.blob) body.set("screenshot", capture.blob, "feedback.jpg");
      const response = await fetch("/api/feedback", { method: "POST", body });
      const data = await response.json() as { item?: FeedbackItem; error?: string; warning?: string };
      if (!response.ok) throw new Error(data.error || "Could not save feedback.");
      await loadItems(path); setTarget(null); setMode("browse"); sendToFrame({ type: "rc-feedback:clear-target" });
      setNotice(data.warning || capture.warning || "Feedback saved.");
    } catch (error) { setNotice(message(error, "Could not save feedback.")); }
    finally { setLoading(false); }
  }

  async function changeStatus(item: FeedbackItem) {
    setLoading(true); setNotice("");
    try {
      const status: FeedbackStatus = item.status === "open" ? "resolved" : "open";
      const response = await fetch(`/api/feedback/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const data = await response.json() as { item?: FeedbackItem; error?: string };
      if (!response.ok) throw new Error(data.error || "Could not update feedback.");
      await loadItems(path); setNotice(status === "resolved" ? "Feedback resolved." : "Feedback reopened.");
    } catch (error) { setNotice(message(error, "Could not update feedback.")); }
    finally { setLoading(false); }
  }

  if (session === undefined) return <div className={styles.root}><div className={styles.gate}><span className={styles.gateMark}>Loading review workspace…</span></div></div>;
  if (!session) return <div className={styles.root}><div className={styles.gate}><span className={styles.gateMark}>Private review</span><h1>{config.projectName}</h1><p>Enter your name and the shared project passcode to review the website.</p><form onSubmit={login}><label>Your name<input name="name" autoComplete="name" maxLength={100} required /></label><label>Passcode<input name="password" type="password" autoComplete="current-password" required /></label><button disabled={loading}>{loading ? "Opening…" : "Open workspace"}</button>{notice && <p className={styles.error} role="alert">{notice}</p>}</form></div></div>;

  return <div className={styles.root}>
    <div className={styles.shell}>
      <header className={styles.toolbar}>
        <div className={styles.brand}>{config.projectName} · Review</div><div className={styles.path}>{path}</div>
        <button className={`${styles.tool} ${mode === "browse" ? styles.toolActive : ""}`} onClick={() => { setMode("browse"); setTarget(null); sendToFrame({ type: "rc-feedback:clear-target" }); }}>Browse</button>
        <button className={`${styles.tool} ${mode === "comment" ? styles.toolActive : ""}`} onClick={() => { setMode("comment"); setTarget(null); }}>+ Comment</button>
        <div className={styles.viewportGroup}>{Object.entries(config.viewports).map(([name]) => <button key={name} className={`${styles.tool} ${breakpoint === name ? styles.toolActive : ""}`} onClick={() => setBreakpoint(name)}>{name}</button>)}</div>
        <button className={`${styles.tool} ${styles.logout}`} onClick={logout}>Log out</button>
      </header>
      <main className={styles.previewArea}>
        <div className={styles.frameWrap} style={{ width: `${config.viewports[breakpoint] ?? 1440}px` }}>
          <iframe ref={iframeRef} className={styles.frame} src={previewUrl(path)} title={`${config.projectName} website preview`} />
        </div>
      </main>
      <aside className={styles.side}>
        <div className={styles.sideHeader}><span className={styles.eyebrow}>Current page</span><div className={styles.sideTitle}><h2>Feedback</h2><span className={styles.count}>{visibleItems.length}</span></div><div className={styles.filters}>{(["open", "resolved", "all"] as Filter[]).map((value) => <button key={value} className={filter === value ? styles.selected : ""} onClick={() => setFilter(value)}>{value}</button>)}</div></div>
        <div className={styles.list}>{visibleItems.length ? visibleItems.map((item, index) => <button key={item.id} className={`${styles.card} ${selectedId === item.id ? styles.cardActive : ""}`} onClick={() => setSelectedId(item.id)}><span className={styles.cardTop}><span className={`${styles.pin} ${item.status === "resolved" ? styles.resolvedPin : ""}`}>{index + 1}</span><span className={styles.label}>{item.elementLabel || "Page"}</span></span><p>{item.comment}</p><span className={styles.meta}>{item.reviewerName} · {new Date(item.createdAt).toLocaleDateString()}</span></button>) : <div className={styles.empty}>No {filter === "all" ? "" : `${filter} `}feedback on this page.<br /><button className={styles.secondary} onClick={() => { setTarget(pageTarget()); setMode("comment"); }}>Comment on the page</button></div>}</div>
        {selected && <div className={styles.detail}><span className={styles.eyebrow}>{selected.status}</span><p>{selected.comment}</p>{selected.screenshotUrl && <a className={styles.screenshot} href={selected.screenshotUrl} target="_blank" rel="noreferrer">Open screenshot</a>}{selected.externalUrl && <a className={styles.screenshot} href={selected.externalUrl} target="_blank" rel="noreferrer">Open provider record</a>}<div className={styles.detailActions}><button className={styles.statusButton} disabled={loading} onClick={() => changeStatus(selected)}>{selected.status === "open" ? "Resolve" : "Reopen"}</button></div></div>}
        {target && <form className={styles.composer} onSubmit={submit}><label>Comment on {target.elementLabel}<textarea name="comment" autoFocus maxLength={config.commentMaxLength} placeholder="What should change?" required /></label><div className={styles.composerActions}><button type="button" className={styles.secondary} onClick={() => { setTarget(null); setMode("browse"); sendToFrame({ type: "rc-feedback:clear-target" }); }}>Cancel</button><button className={styles.primary} disabled={loading}>{loading ? "Saving…" : "Save feedback"}</button></div></form>}
      </aside>
    </div>
    {notice && <div className={styles.notice} role="status">{notice}</div>}
  </div>;
}
