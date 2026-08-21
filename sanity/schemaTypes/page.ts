import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "title", type: "string", title: "Meta title" },
        { name: "description", type: "text", rows: 3, title: "Meta description" },
        { name: "image", type: "image", title: "Social image" },
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});

