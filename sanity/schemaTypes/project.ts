import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
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
    defineField({
      name: "featuredTitle",
      title: "Featured card title",
      type: "string",
      description: "Optional alternate title used in the featured project rail.",
    }),
    defineField({
      name: "discipline",
      type: "string",
      options: {
        list: ["Architecture", "Interior Design"],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      description: "For example: Commercial, Residential, or Civic & Cultural.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "location", type: "string" }),
    defineField({
      name: "year",
      type: "number",
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: "yearRange",
      title: "Display year or range",
      type: "string",
      description: "Optional display value such as 2019–2020. Falls back to Year.",
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: ["Concept", "In progress", "Completed"],
        layout: "radio",
      },
    }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alternative text" }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "detailEyebrow", title: "Case study eyebrow", type: "string", description: "Falls back to Category." }),
    defineField({ name: "summary", title: "Case study summary", type: "text", rows: 2 }),
    defineField({ name: "introduction", title: "Case study introduction", type: "text", rows: 5 }),
    defineField({ name: "facts", type: "array", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "value", type: "string", validation: (rule) => rule.required() }),
    ], preview: { select: { title: "label", subtitle: "value" } } })] }),
    defineField({ name: "storySections", title: "Case study sections", type: "array", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "body", type: "text", rows: 6 }),
      defineField({ name: "layout", type: "string", options: { list: [{ title: "Image left", value: "image-left" }, { title: "Image right", value: "image-right" }, { title: "Wide image", value: "wide" }], layout: "radio" }, initialValue: "image-left", validation: (rule) => rule.required() }),
      defineField({ name: "image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string", validation: (rule) => rule.required() })], validation: (rule) => rule.required() }),
    ], preview: { select: { title: "title", subtitle: "layout", media: "image" } } })] }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({
      name: "relatedProjects",
      title: "Related projects",
      description: "Optional hand-picked projects shown after the case study.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (rule) => rule.max(6).unique(),
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alternative text" },
            { name: "caption", type: "string" },
          ],
        },
      ],
      options: { layout: "grid" },
    }),
    defineField({ name: "seo", title: "Search and social", type: "object", options: { collapsible: true, collapsed: true }, fields: [
      defineField({ name: "title", title: "Meta title", type: "string", validation: (rule) => rule.max(70) }),
      defineField({ name: "description", title: "Meta description", type: "text", rows: 3, validation: (rule) => rule.max(160) }),
      defineField({ name: "image", title: "Social image", type: "image", options: { hotspot: true } }),
    ] }),
  ],
  orderings: [
    {
      title: "Year, newest",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
      year: "year",
      media: "coverImage",
    },
    prepare: ({ title, location, year, media }) => ({
      title,
      subtitle: [location, year].filter(Boolean).join(" · "),
      media,
    }),
  },
});
