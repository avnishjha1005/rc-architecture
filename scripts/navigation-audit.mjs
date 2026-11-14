const targets = await fetch("http://localhost:9223/json/list").then((response) => response.json());
const directPath = process.argv[2];
const target = targets.find((item) => item.type === "page");
if (!target?.webSocketDebuggerUrl) throw new Error("No debuggable browser page found");

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const findings = [];
let commandId = 0;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
    return;
  }

  if (message.method === "Runtime.exceptionThrown") {
    findings.push(message.params.exceptionDetails?.exception?.description || message.params.exceptionDetails?.text || "Runtime exception");
  }
  if (message.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(message.params.type)) {
    findings.push(message.params.args.map((argument) => argument.value || argument.description || "").join(" "));
  }
  if (message.method === "Log.entryAdded" && ["error", "warning"].includes(message.params.entry.level)) {
    findings.push(message.params.entry.text);
  }
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

function send(method, params = {}) {
  const id = ++commandId;
  const response = new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  socket.send(JSON.stringify({ id, method, params }));
  return response;
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result?.value;
}

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function follow(href) {
  const previousPathname = await evaluate("location.pathname");
  await evaluate("(() => { window.__navigationAuditText = document.querySelector('main')?.innerText.slice(0, 500) || ''; return true; })()");
  const clicked = await evaluate(`(() => {
    const link = [...document.querySelectorAll('a[href]')].find((candidate) => candidate.getAttribute('href') === ${JSON.stringify(href)});
    if (!link) return false;
    link.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Link not found from ${await evaluate("location.pathname")}: ${href}`);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const routeCommitted = await evaluate(`location.pathname !== ${JSON.stringify(previousPathname)} && (document.querySelector('main')?.innerText.slice(0, 500) || '') !== window.__navigationAuditText`);
    if (routeCommitted) break;
    await pause(20);
  }
  let peakAnimatedElements = 0;
  for (let sample = 0; sample < 14; sample += 1) {
    const animatedElements = await evaluate(`(() => [...document.querySelectorAll('[data-motion-item], [data-motion-image], [data-motion-heading]')].filter((element) => {
      const style = getComputedStyle(element);
      return Number(style.opacity) < 0.999 || (style.transform !== 'none' && style.transform !== 'matrix(1, 0, 0, 1, 0, 0)');
    }).length)()`);
    peakAnimatedElements = Math.max(peakAnimatedElements, animatedElements);
    await pause(50);
  }
  await pause(700);
  const state = await evaluate(`(() => {
    const main = document.querySelector('main');
    const visibleElements = [...document.querySelectorAll('main h1, main h2, main p, main img, main a')].filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.05;
    }).length;
    const heading = document.querySelector('main h1, main h2');
    const headingStyle = heading ? getComputedStyle(heading) : null;
    return {
      pathname: location.pathname,
      visibleElements,
      headingOpacity: headingStyle?.opacity || null,
      headingVisibility: headingStyle?.visibility || null,
      mainHeight: main?.getBoundingClientRect().height || 0,
      scrollY,
      visibleCrash: document.body.innerText.includes('Cannot read properties of undefined'),
    };
  })()`);
  const { pathname, visibleCrash } = state;
  if (visibleCrash) findings.push(`Visible error boundary on ${pathname}`);
  if (state.mainHeight < 1 || state.visibleElements < 1) findings.push(`Blank viewport on ${pathname}: ${JSON.stringify(state)}`);
  if (peakAnimatedElements < 1) findings.push(`No observable route animation on ${pathname}`);
  process.stdout.write(`${pathname} animated=${peakAnimatedElements} visible=${state.visibleElements} heading=${state.headingOpacity}/${state.headingVisibility} scrollY=${state.scrollY}\n`);
}

await send("Runtime.enable");
await send("Log.enable");
await send("Page.enable");
await send("Page.navigate", { url: `http://127.0.0.1:4010${directPath || "/"}` });
await pause(1_200);

if (directPath) {
  const counterTimeline = [];
  if (directPath === "/about") {
    await evaluate(`(() => {
      const stats = document.querySelector('[aria-label="Studio statistics"]');
      if (stats) scrollTo(0, stats.getBoundingClientRect().top + scrollY - innerHeight * 0.35);
    })()`);
    for (let sample = 0; sample < 18; sample += 1) {
      counterTimeline.push(await evaluate(`[...document.querySelectorAll('[aria-label="Studio statistics"] strong span')].map((element) => element.textContent)`));
      await pause(100);
    }
  }
  for (const progress of [0.25, 0.5, 0.75, 1]) {
    await evaluate(`scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * ${progress})`);
    await pause(250);
  }
  await evaluate("scrollTo(0, 0)");
  await pause(500);
  const state = await evaluate(`(() => ({
    pathname: location.pathname,
    title: document.title,
    mainHeight: document.querySelector('main')?.getBoundingClientRect().height || 0,
    bodyWidth: document.body.scrollWidth,
    viewportWidth: innerWidth,
    counterValues: [...document.querySelectorAll('[aria-label="Studio statistics"] strong span')].map((element) => element.textContent),
    counterTimeline: ${JSON.stringify(counterTimeline)},
    text: document.querySelector('main')?.innerText.slice(0, 300) || ''
  }))()`);
  process.stdout.write(`${JSON.stringify(state)}\n`);
  socket.close();
  const ignored = ["favicon.ico", "ERR_ABORTED", "ERR_NETWORK_IO_SUSPENDED"];
  const directFindings = findings.filter((finding) => finding && !ignored.some((message) => finding.includes(message)));
  if (directFindings.length) {
    console.error(directFindings.join("\n---\n"));
    process.exit(1);
  }
  console.log("navigation_console_findings=0");
  process.exit(0);
}

for (const href of ["/about", "/services", "/projects"]) {
  await follow(href);
}

const firstProjectHref = await evaluate(`[...document.querySelectorAll('a[href^="/projects/"]')]
  .map((link) => link.getAttribute('href'))
  .find(Boolean)`);
if (!firstProjectHref) throw new Error("No project-detail link found on /projects");
await follow(firstProjectHref);

const blogIndexHref = await evaluate(`[...document.querySelectorAll('a[href]')]
  .map((link) => link.getAttribute('href'))
  .find((href) => href === '/blog' || href === '/blogs')`);
if (!blogIndexHref) throw new Error("No blog index link found in the project navigation");
await follow(blogIndexHref);
const firstBlogHref = await evaluate(`[...document.querySelectorAll('a[href^="/blog/"], a[href^="/blogs/"]')]
  .map((link) => link.getAttribute('href'))
  .find(Boolean)`);
if (!firstBlogHref) throw new Error("No blog-detail link found on the blog index");
await follow(firstBlogHref);
await follow(blogIndexHref);
await follow(firstBlogHref);

for (const href of [
  "/contact",
  "/clients",
  "/",
]) {
  await follow(href);
}

socket.close();

const ignoredNetworkMessages = [
  "favicon.ico",
  "ERR_ABORTED",
  "ERR_NETWORK_IO_SUSPENDED",
  "was preloaded using link preload but not used within a few seconds",
];
const relevantFindings = findings.filter((finding) => (
  finding && !ignoredNetworkMessages.some((message) => finding.includes(message))
));
if (relevantFindings.length) {
  console.error(relevantFindings.join("\n---\n"));
  process.exitCode = 1;
} else {
  console.log("navigation_console_findings=0");
}
