import type { SanityClient } from "next-sanity";
import { draftMode } from "next/headers";

import { apiVersion, dataset, projectId } from "../env";

let clientPromise: Promise<SanityClient> | undefined;

function getBaseClient() {
  clientPromise ??= (async () => {
    const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    if (storageDescriptor?.get && storageDescriptor.configurable) {
      Reflect.deleteProperty(globalThis, "localStorage");
    }

    const { createClient } = await import("next-sanity");
    return createClient({
      apiVersion,
      dataset,
      maxRetries: 1,
      projectId,
      timeout: 8_000,
      useCdn: true,
    });
  })();

  return clientPromise;
}

export async function getSanityClient() {
  const client = await getBaseClient();
  const { isEnabled } = await draftMode();
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!isEnabled || !token) return client;
  return client.withConfig({ token, useCdn: false, perspective: "drafts" });
}
