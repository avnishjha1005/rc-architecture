import { defineField, defineType } from "sanity";

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
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

