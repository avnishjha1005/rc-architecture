import type { Metadata } from "next";
import { defineQuery } from "next-sanity";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";

export type SeoData = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

type MetadataFallback = {
  title: string;
  description: string;
};

const singletonSeoQuery = defineQuery(`
  coalesce(*[_id == $documentType][0], *[_type == $documentType] | order(_updatedAt desc)[0]){
    "seo": seo{
      title,
      description,
      "imageUrl": image.asset->url
    }
  }
`);

export function metadataFromSeo(seo: SeoData | null | undefined, fallback: MetadataFallback): Metadata {
  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description;
  const image = seo?.imageUrl;

  return {
    title,
    description,
    ...(image ? {
      openGraph: { title, description, images: [{ url: image }] },
      twitter: { card: "summary_large_image", title, description, images: [image] },
    } : {}),
  };
}

export async function getSingletonMetadata(documentType: string, fallback: MetadataFallback): Promise<Metadata> {
  if (!isSanityConfigured) return metadataFromSeo(undefined, fallback);

  try {
    const sanityClient = await getSanityClient();
    const result = await sanityClient.fetch<{ seo?: SeoData } | null>(
      singletonSeoQuery,
      { documentType },
      { next: { revalidate: 60 } },
    );
    return metadataFromSeo(result?.seo, fallback);
  } catch (error) {
    console.error(`Unable to load ${documentType} SEO metadata from Sanity`, error);
    return metadataFromSeo(undefined, fallback);
  }
}
