import projections from "../.staging-design/projections.json";
import { getSanityClient as getPublishedClient } from "../sanity/lib/client.ts";

export async function getSanityClient() {
  const live = await getPublishedClient();
  return {
    async fetch(query, params = {}, options) {
      const rows = projections[query];
      const key = JSON.stringify(params);
      if (rows && Object.hasOwn(rows, key)) return structuredClone(rows[key]);
      return live.fetch(query, params, options);
    },
  };
}
