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
};
export type NewsletterSectionData = {
  eyebrow: string;
  title: string;
  description: string;
  placeholder: string;
  buttonLabel: string;
  imageUrl: string;
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
    hoursLabel: string;
    legal: string;
  };
};

export const defaultSiteData = rawSiteData satisfies SiteData;

export function toTelephoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function toDirectionsHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
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
