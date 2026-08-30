import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "navigation", title: "Navigation" },
    { name: "contactDetails", title: "Contact details" },
    { name: "sharedSections", title: "Shared sections" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3, group: "general" }),
    defineField({ name: "logo", type: "image", options: { hotspot: true }, group: "general" }),
    defineField({ name: "email", type: "email", group: ["contactDetails", "footer"] }),
    defineField({ name: "phone", type: "string", group: ["contactDetails", "footer"] }),
    defineField({ name: "address", type: "text", rows: 3, group: ["contactDetails", "footer"] }),
    defineField({ name: "instagram", type: "url", group: "contactDetails" }),
    defineField({
      name: "navigation",
      type: "array",
      group: ["navigation", "footer"],
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "href", type: "string", validation: (rule) => rule.required() }),
      ] })],
      validation: (rule) => rule.max(7),
    }),
    defineField({ name: "cta", title: "Header button", type: "object", group: "navigation", fields: [
      defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "href", type: "string", validation: (rule) => rule.required() }),
    ] }),
    defineField({ name: "hours", type: "text", rows: 3, group: ["contactDetails", "footer"] }),
    defineField({ name: "offices", type: "array", group: "contactDetails", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "city", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "address", type: "text", rows: 3, validation: (rule) => rule.required() }),
      defineField({ name: "phone", type: "string", validation: (rule) => rule.required() }),
    ], preview: { select: { title: "city", subtitle: "phone" } } })] }),
    defineField({ name: "socialLinks", type: "array", group: "contactDetails", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "url", type: "url", validation: (rule) => rule.required() }),
      defineField({ name: "shortLabel", type: "string", validation: (rule) => rule.required().max(4) }),
    ], preview: { select: { title: "label", subtitle: "url" } } })] }),
    defineField({ name: "contact", title: "Global contact banner", type: "object", group: "sharedSections", fields: [
      defineField({ name: "eyebrow", type: "string", initialValue: "Contact us" }),
      defineField({ name: "title", type: "text", rows: 2, initialValue: "Get in touch\nwith us for projects." }),
      defineField({ name: "description", type: "text", rows: 3 }),
      defineField({ name: "cta", title: "Button", type: "object", fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "href", title: "Link", type: "string" }),
      ] }),
      defineField({ name: "image", type: "image", options: { hotspot: true }, fields: [
        defineField({ name: "alt", type: "string", validation: (rule) => rule.required() }),
      ] }),
    ] }),
    defineField({ name: "newsletter", title: "Global newsletter", type: "object", group: "sharedSections", fields: [
      defineField({ name: "eyebrow", type: "string", initialValue: "Newsletter" }),
      defineField({ name: "title", type: "text", rows: 2, initialValue: "Subscribe to\nour newsletter." }),
      defineField({ name: "description", type: "text", rows: 3 }),
      defineField({ name: "placeholder", type: "string" }),
      defineField({ name: "buttonLabel", type: "string" }),
      defineField({ name: "image", title: "Background drawing", type: "image" }),
    ] }),
    defineField({ name: "footer", type: "object", group: "footer", fields: [
      defineField({ name: "eyebrow", type: "string" }),
      defineField({ name: "title", type: "text", rows: 2 }),
      defineField({ name: "blurb", type: "text", rows: 3 }),
      defineField({ name: "addressLabel", type: "string" }),
      defineField({ name: "hoursLabel", type: "string" }),
      defineField({ name: "legal", type: "text", rows: 4 }),
    ] }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
