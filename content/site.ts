import rawSiteData from "./site.json";

export type SiteLink = { label: string; href: string };
export type Office = { city: string; address: string; phone: string };
export type SocialLink = { label: string; href: string; shortLabel: string };
export type ContactSectionData = {
  eyebrow: string;
  title: string;
  description: string;
  cta: SiteLink;
  imageUrl: string;
  imageAlt: string;
  mobileImageUrl?: string;
};
export type NewsletterSectionData = {
  eyebrow: string;
  title: string;
  description: string;
  placeholder: string;
  buttonLabel: string;
  imageUrl: string;
  innerImageUrl?: string;
};

export type SiteData = {
  brandName: string;
  navigation: SiteLink[];
  cta: SiteLink;
  email: string;
  phone: string;
  address: string;
  hours: string;
  offices: Office[];
  socialLinks: SocialLink[];
  contact: ContactSectionData;
  newsletter: NewsletterSectionData;
  footer: {
    eyebrow: string;
    title: string;
    blurb: string;
    addressLabel: string;
    city?: string;
    hoursLabel: string;
    legal: string;
  };
};

export const defaultSiteData = rawSiteData satisfies SiteData;

export function toTelephoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function toDirectionsHref(address: string) {
  const url = new URL("https://www.google.com/maps");
  if (address.trim() === defaultSiteData.address) {
    url.search = "um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KTGT30bUFa47MUfUGxn_qz7C";
  }
  url.searchParams.set("daddr", address);
  return url.toString();
}

export function toGoogleMapsEmbedHref(address: string) {
  const url = new URL("https://www.google.com/maps");
  url.searchParams.set("q", address.trim());
  url.searchParams.set("z", "16");
  url.searchParams.set("output", "embed");
  return url.toString();
}

export function siteFooter(site: SiteData) {
  return {
    ...site.footer,
    email: site.email,
    address: site.address,
    phone: site.phone,
    hours: site.hours,
    navigation: site.navigation,
  };
}

export type SiteFooterContent = ReturnType<typeof siteFooter>;
