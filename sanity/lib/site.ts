import { defaultSiteData, type SiteData } from "@/content/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "./client";
import { siteSettingsQuery } from "./queries";

type CmsSiteData = Partial<Omit<SiteData, "footer">> & {
  footer?: Partial<SiteData["footer"]>;
};

export async function getSiteData(): Promise<SiteData> {
  if (!isSanityConfigured) return defaultSiteData;

  try {
    const sanityClient = await getSanityClient();
    const data = await sanityClient.fetch<CmsSiteData | null>(siteSettingsQuery, {}, { next: { revalidate: 60 } });
    if (!data) return defaultSiteData;

    return {
      ...defaultSiteData,
      ...data,
      navigation: data.navigation?.length ? data.navigation : defaultSiteData.navigation,
      cta: data.cta?.label && data.cta.href ? data.cta : defaultSiteData.cta,
      offices: data.offices?.length ? data.offices : defaultSiteData.offices,
      socialLinks: data.socialLinks?.filter((link) => link.label && link.href) ?? defaultSiteData.socialLinks,
      footer: { ...defaultSiteData.footer, ...data.footer },
    };
  } catch (error) {
    console.error("Unable to load global site settings from Sanity", error);
    return defaultSiteData;
  }
}
