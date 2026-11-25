import { getSanityClient as getPublishedClient } from "../sanity/lib/client.ts";

let projections;

export async function getSanityClient() {
  const live = await getPublishedClient();
  return {
    async fetch(query, params = {}, options) {
      projections ??= import("../.staging-design/projections.json").then(({ default: rows }) => rows);
      const rows = (await projections)[query];
      const key = JSON.stringify(params);
      if (rows && Object.hasOwn(rows, key)) return structuredClone(rows[key]);
      return live.fetch(query, params, options);
    },
  };
}
