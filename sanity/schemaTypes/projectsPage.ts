import { defineArrayMember, defineField, defineType } from "sanity";

export const projectsPage = defineType({
  name: "projectsPage",
  title: "Projects page",
  type: "document",
  groups: [
    { name: "featured", title: "Featured work", default: true },
    { name: "archive", title: "Project archive" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "featuredHeading",
      title: "Heading",
      type: "text",
      rows: 2,
      group: "featured",
      initialValue: "Featured\nWork",
      description: "Press return to control the line break.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "featuredIntro",
      title: "Introduction",
      type: "text",
      rows: 3,
      group: "featured",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "featuredYearRange",
      title: "Year range",
      type: "string",
      group: "featured",
      description: "For example: 1999–2023.",
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "featuredProjects",
      title: "Featured projects",
      type: "array",
      group: "featured",
      description: "Drag to set the order used by the featured rail.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "project" }],
        }),
      ],
      validation: (rule) => rule.required().min(1).max(5).unique(),
    }),
    defineField({
      name: "archiveEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "archive",
      initialValue: "(All projects)",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "archiveHeading",
      title: "Heading",
      type: "text",
      rows: 2,
      group: "archive",
      initialValue: "Our Latest\nProjects.",
      description: "Press return to control the line break.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "archiveIntro",
      title: "Introduction",
      type: "text",
      rows: 3,
      group: "archive",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "archiveProjects",
      title: "Archive projects",
      type: "array",
      group: "archive",
      description:
        "Optional. Select and order projects manually; leave empty to show every project, newest first.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "project" }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "loadMoreLabel",
      title: "Load more button label",
      type: "string",
      group: "archive",
      initialValue: "Load more",
      validation: (rule) => rule.required().max(32),
    }),
    defineField({
      name: "seo",
      title: "Search and social",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "title",
          title: "Meta title",
          type: "string",
          validation: (rule) => rule.max(70),
        }),
        defineField({
          name: "description",
          title: "Meta description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.max(160),
        }),
        defineField({
          name: "image",
          title: "Social image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Projects page" }) },
});
