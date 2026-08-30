import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage", title: "Contact page", type: "document",
  groups: [{ name: "hero", title: "Hero", default: true }, { name: "information", title: "Contact information" }, { name: "careers", title: "Careers" }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "heroTitle", type: "string", group: "hero", initialValue: "Let’s Discuss.", validation: (r) => r.required() }),
    defineField({ name: "heroIntro", type: "text", rows: 4, group: "hero" }),
    defineField({ name: "heroImage", type: "image", group: "hero", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })] }),
    defineField({ name: "infoEyebrow", type: "string", group: "information", initialValue: "Contact info" }),
    defineField({ name: "infoHeading", type: "text", rows: 2, group: "information", initialValue: "Get in touch\nwith us." }),
    defineField({ name: "infoIntro", type: "text", rows: 4, group: "information" }),
    defineField({ name: "phoneLabel", type: "string", group: "information", initialValue: "Phone number" }),
    defineField({ name: "emailLabel", type: "string", group: "information", initialValue: "Email" }),
    defineField({ name: "mainOfficeLabel", type: "string", group: "information", initialValue: "Main office (Bengaluru)" }),
    defineField({
      name: "mapUrl",
      title: "Google Maps link",
      type: "url",
      group: "information",
      description: "Paste a full Google Maps place, search, or embed link. Short maps.app.goo.gl links will use the main office address for the embed.",
      validation: (rule) => rule.uri({ scheme: ["https"] }).custom((value) => {
        if (!value) return true;

        try {
          const hostname = new URL(value).hostname;
          return hostname === "maps.app.goo.gl" || hostname === "google.com" || hostname.endsWith(".google.com")
            ? true
            : "Enter a Google Maps link.";
        } catch {
          return "Enter a valid Google Maps link.";
        }
      }),
    }),
    defineField({ name: "satelliteOfficesHeading", type: "string", group: "information", initialValue: "Satellite offices" }),
    defineField({ name: "socialLabel", type: "string", group: "information", initialValue: "Follow us" }),
    defineField({ name: "careersEyebrow", type: "string", group: "careers", initialValue: "Careers" }),
    defineField({ name: "seo", type: "object", group: "seo", fields: [defineField({ name: "title", type: "string", validation: (r) => r.max(70) }), defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.max(160) }), defineField({ name: "image", type: "image", options: { hotspot: true } })] }),
  ], preview: { prepare: () => ({ title: "Contact page" }) },
});
