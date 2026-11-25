import { readFile } from "node:fs/promises";
import { aboutPageQuery, contactPageQuery, projectsPageQuery } from "../sanity/lib/queries.ts";

const projections = JSON.parse(await readFile(".staging-design/projections.json", "utf8"));
for (const [page, expected] of [
  ["about", projections[aboutPageQuery]["{}"].heroImageData.src.split("/").at(-1)],
  ["projects", projections[projectsPageQuery]["{}"].page.featuredYearRange],
  ["contact", projections[contactPageQuery]["{}"].heroImageUrl.split("/").at(-1).split("-")[0]],
]) {
  const html = await readFile(`.next/server/app/${page}.html`, "utf8");
  if (!expected || !html.includes(expected)) throw new Error(`The built /${page} page does not contain the staged CMS data; refusing deployment.`);
}
