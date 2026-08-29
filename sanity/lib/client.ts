import { createClient } from "next-sanity";
import { draftMode } from "next/headers";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: true,
});

export async function getSanityClient() {
  const { isEnabled } = await draftMode();
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!isEnabled || !token) return client;
  return client.withConfig({ token, useCdn: false, perspective: "drafts" });
}
