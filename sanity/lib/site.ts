import { defaultSiteData, type SiteData } from "@/content/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { reportSanityError } from "./errors";
import { siteSettingsQuery } from "./queries";
import { urlFor } from "./image";

type CmsSiteData = Partial<Omit<SiteData, "footer" | "contact" | "newsletter">> & {
  footer?: Partial<SiteData["footer"]>;
  contact?: Partial<SiteData["contact"]> & { cta?: Partial<SiteData["contact"]["cta"]>; image?: { asset?: { _ref: string } }; mobileImage?: { asset?: { _ref: string } } };
  newsletter?: Partial<SiteData["newsletter"]>;
};

function validSiteLink(link: Partial<SiteData["cta"]> | null | undefined): link is SiteData["cta"] {
  return Boolean(link && typeof link.label === "string" && link.label.trim() && typeof link.href === "string" && link.href.trim());
}

function definedFields<T extends object>(value: Partial<T> | null | undefined): Partial<T> {
  if (!value) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== null && fieldValue !== undefined),
  ) as Partial<T>;
}

export async function getSiteData(): Promise<SiteData> {
  if (!isSanityConfigured) return defaultSiteData;

  try {
    const sanityClient = await getSanityClient();
    const data = await sanityClient.fetch<CmsSiteData | null>(siteSettingsQuery, {}, { next: { revalidate: 60 } });
    if (!data) return defaultSiteData;

    const contact = data.contact;
    const newsletter = data.newsletter;
    const navigation = data.navigation?.filter(validSiteLink) || [];

    return {
      ...defaultSiteData,
      brandName: data.brandName || defaultSiteData.brandName,
      email: data.email || defaultSiteData.email,
      phone: data.phone || defaultSiteData.phone,
      address: data.address || defaultSiteData.address,
      hours: data.hours || defaultSiteData.hours,
      navigation: navigation.length ? navigation : defaultSiteData.navigation,
      cta: validSiteLink(data.cta) ? data.cta : defaultSiteData.cta,
      offices: data.offices?.length ? data.offices : defaultSiteData.offices,
      socialLinks: data.socialLinks?.filter((link) => link.label && link.href).length
        ? data.socialLinks.filter((link) => link.label && link.href)
        : defaultSiteData.socialLinks,
      contact: {
        ...defaultSiteData.contact,
        ...(contact?.eyebrow ? { eyebrow: contact.eyebrow } : {}),
        ...(contact?.title ? { title: contact.title } : {}),
        ...(contact?.description ? { description: contact.description } : {}),
        ...(contact?.image?.asset?._ref ? { imageUrl: urlFor(contact.image).width(2560).height(1600).fit("crop").url() } : {}),
        ...(contact?.imageAlt ? { imageAlt: contact.imageAlt } : {}),
        mobileImageUrl: contact?.mobileImage?.asset?._ref ? urlFor(contact.mobileImage).width(790).height(1330).fit("crop").url() : undefined,
        cta: validSiteLink(contact?.cta) ? contact.cta : defaultSiteData.contact.cta,
      },
      newsletter: {
        ...defaultSiteData.newsletter,
        ...(newsletter?.eyebrow ? { eyebrow: newsletter.eyebrow } : {}),
        ...(newsletter?.title ? { title: newsletter.title } : {}),
        ...(newsletter?.description ? { description: newsletter.description } : {}),
        ...(newsletter?.placeholder ? { placeholder: newsletter.placeholder } : {}),
        ...(newsletter?.buttonLabel ? { buttonLabel: newsletter.buttonLabel } : {}),
        ...(newsletter?.imageUrl ? { imageUrl: newsletter.imageUrl } : {}),
        innerImageUrl: newsletter?.innerImageUrl || undefined,
      },
      footer: { ...defaultSiteData.footer, ...definedFields<SiteData["footer"]>(data.footer), city: data.footer?.city || undefined },
    };
  } catch (error) {
    reportSanityError("Unable to load global site settings from Sanity", error);
    return defaultSiteData;
  }
}
