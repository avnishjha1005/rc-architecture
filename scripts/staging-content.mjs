import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { extname } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { at, patch, set } from "@sanity/mutate";
import { getAtPath, parse as parsePath } from "@sanity/mutate/path";
import { applyInCollection } from "@sanity/mutate/_unstable_apply";
import { evaluate, parse } from "groq-js";
import * as queries from "../sanity/lib/queries.ts";
import { featuredProjectSlugs } from "../content/featured-projects.mjs";

const endpoint = new URL("https://dlbl0h64.api.sanity.io/v2025-02-19/data/query/production");
endpoint.searchParams.set("perspective", "published");
endpoint.searchParams.set("query", '*[!(_id in path("_.**")) && _type in ["project","client","blogPost","homePage","aboutPage","contactPage","clientsPage","projectsPage","servicesPage","blogPage","siteSettings","sanity.imageAsset"]]{...select(_type == "sanity.imageAsset" => {_id,_type,url,metadata{dimensions,lqip}}, @)}');
const response = await fetch(endpoint);
if (!response.ok) throw new Error(`Cannot read public CMS documents: HTTP ${response.status}`);
let { result: docs } = await response.json();
for (const { url, width, height } of JSON.parse(await readFile("scripts/design-assets.json", "utf8"))) {
  const bytes = await readFile(`public${url}`);
  const id = `image-${createHash("sha1").update(bytes).digest("hex")}-${width}x${height}-${extname(url).slice(1)}`;
  if (!docs.some(doc => doc._id === id)) {
    docs.push({ _id: id, _type: "sanity.imageAsset", url, metadata: { dimensions: { width, height } } });
  }
}
for (const file of (await readdir("scripts/design-content")).filter(file => file.endsWith(".json")).sort()) {
  for (const change of JSON.parse(await readFile(`scripts/design-content/${file}`, "utf8"))) {
    const entries = Object.entries(change.set).map(([path, value]) => [parsePath(path), value]);
    docs = applyInCollection(docs, patch(change.id, entries.map(([path, value]) => at(path, set(value)))));
    const doc = docs.find(doc => doc._id === change.id);
    for (const [path, value] of entries) {
      if (!doc || !isDeepStrictEqual(getAtPath(path, doc), value)) {
        throw new Error(`Cannot rehearse ${file}: ${change.id} / ${JSON.stringify(path)}`);
      }
    }
  }
}

const results = {};
for (const [name, query] of Object.entries(queries)) {
  let parameters = [{}];
  if (name === "homePageQuery") parameters = [{ featuredSlugs: featuredProjectSlugs }];
  if (name === "projectBySlugQuery" || name === "blogPostBySlugQuery") {
    const type = name === "projectBySlugQuery" ? "project" : "blogPost";
    parameters = docs.filter(doc => doc._type === type && doc.slug?.current).map(doc => ({ slug: doc.slug.current }));
  }
  results[query] = {};
  for (const params of parameters) {
    const tree = parse(query, { params });
    const value = await evaluate(tree, { dataset: docs, params });
    results[query][JSON.stringify(params)] = await value.get();
  }
}
await mkdir(".staging-design", { recursive: true });
await writeFile(".staging-design/projections.json", JSON.stringify(results));
console.log(`Prepared ${Object.values(results).reduce((n, rows) => n + Object.keys(rows).length, 0)} public staging projections without writing to Sanity.`);
