import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "email", type: "email" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "address", type: "text", rows: 3 }),
    defineField({ name: "instagram", type: "url" }),
    defineField({
      name: "navigation",
      type: "array",
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "href", type: "string", validation: (rule) => rule.required() }),
      ] })],
      validation: (rule) => rule.max(7),
    }),
    defineField({ name: "cta", title: "Header button", type: "object", fields: [
      defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "href", type: "string", validation: (rule) => rule.required() }),
    ] }),
    defineField({ name: "hours", type: "text", rows: 3 }),
    defineField({ name: "offices", type: "array", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "city", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "address", type: "text", rows: 3, validation: (rule) => rule.required() }),
      defineField({ name: "phone", type: "string", validation: (rule) => rule.required() }),
    ], preview: { select: { title: "city", subtitle: "phone" } } })] }),
    defineField({ name: "socialLinks", type: "array", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "url", type: "url", validation: (rule) => rule.required() }),
      defineField({ name: "shortLabel", type: "string", validation: (rule) => rule.required().max(4) }),
    ], preview: { select: { title: "label", subtitle: "url" } } })] }),
    defineField({ name: "footer", type: "object", fields: [
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
