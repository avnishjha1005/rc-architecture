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
