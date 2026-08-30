import { defineArrayMember, defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "proof", title: "Practice highlights" },
    { name: "about", title: "About" },
    { name: "services", title: "Services" },
    { name: "projects", title: "Projects" },
    { name: "labs", title: "Space Labs" },
  ],
  fields: [
    defineField({
      name: "heroImage", title: "Hero image", type: "image", group: "hero",
      description: "Use a wide landscape image (ideally 16:9 or wider).", options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string", description: "Describe the image for visitors using screen readers.", validation: (rule) => rule.required() })],
    }),
    defineField({ name: "headlineTop", title: "Headline — top line", type: "string", group: "hero", initialValue: "Let’s Go", validation: (rule) => rule.required().max(24) }),
    defineField({ name: "headlineAccent", title: "Headline — red word", type: "string", group: "hero", initialValue: "space", validation: (rule) => rule.required().max(16) }),
    defineField({ name: "headlineEnd", title: "Headline — final word", type: "string", group: "hero", initialValue: "making", validation: (rule) => rule.required().max(16) }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 4, group: "hero", validation: (rule) => rule.required().max(280) }),
    defineField({
      name: "stats", title: "Practice highlights", type: "array", group: "proof", description: "Short proof points displayed along the bottom of the hero.",
      of: [defineArrayMember({
        name: "stat", type: "object",
        fields: [
          defineField({ name: "value", type: "string", description: "For example: 100+", validation: (rule) => rule.required().max(12) }),
          defineField({ name: "label", type: "text", rows: 2, description: "Press return to control the line break.", validation: (rule) => rule.required().max(48) }),
        ],
        preview: { select: { title: "value", subtitle: "label" } },
      })],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "about", title: "About section", type: "object", group: "about",
      fields: [
        defineField({ name: "eyebrow", type: "string", initialValue: "About us" }),
        defineField({
          name: "title",
          title: "About headline",
          type: "text",
          rows: 2,
          initialValue: "We are Idea\nFarmers.",
          description: "Controls the ‘We are Idea Farmers.’ heading. Press return to control line breaks.",
          validation: (rule) => rule.required().max(80),
        }),
        defineField({ name: "description", type: "text", rows: 3 }),
        defineField({ name: "cta", title: "Button", type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", title: "Link", type: "string" })] }),
        defineField({ name: "ideologiesLabel", type: "string", initialValue: "Our ideologies" }),
        defineField({ name: "ideologies", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "description", type: "text", rows: 4 })], preview: { select: { title: "title" } } })] }),
      ],
    }),
    defineField({
      name: "services", title: "Services section", type: "object", group: "services",
      fields: [
        defineField({ name: "eyebrow", type: "string" }), defineField({ name: "title", type: "text", rows: 2 }), defineField({ name: "intro", type: "text", rows: 3 }),
        defineField({ name: "cta", title: "Button", type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", title: "Link", type: "string" })] }),
        defineField({ name: "items", title: "Service cards", type: "array", of: [defineArrayMember({ type: "object", fields: [
          defineField({ name: "number", type: "string" }), defineField({ name: "title", type: "string" }), defineField({ name: "description", type: "text", rows: 3 }),
          defineField({ name: "features", type: "array", of: [{ type: "string" }] }),
          defineField({ name: "image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] }),
        ], preview: { select: { title: "title", subtitle: "number", media: "image" } } })] }),
      ],
    }),
    defineField({
      name: "projects", title: "Featured projects section", type: "object", group: "projects",
      fields: [
        defineField({ name: "eyebrow", type: "string" }), defineField({ name: "title", type: "text", rows: 2 }), defineField({ name: "intro", type: "text", rows: 3 }),
        defineField({ name: "cta", title: "Button", type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", title: "Link", type: "string" })] }),
        defineField({ name: "items", title: "Project cards", type: "array", validation: (rule) => rule.max(4), of: [defineArrayMember({ type: "object", fields: [
          defineField({ name: "title", type: "string" }), defineField({ name: "category", type: "string" }), defineField({ name: "year", type: "string" }), defineField({ name: "href", title: "Link", type: "string" }),
          defineField({ name: "image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] }),
        ], preview: { select: { title: "title", subtitle: "year", media: "image" } } })] }),
      ],
    }),
    defineField({
      name: "labs", title: "Space Labs section", type: "object", group: "labs",
      fields: [
        defineField({ name: "eyebrow", type: "string" }), defineField({ name: "intro", type: "text", rows: 3 }),
        defineField({ name: "cta", title: "Button", type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", title: "Link", type: "string" })] }),
        defineField({ name: "articles", type: "array", validation: (rule) => rule.max(4), of: [defineArrayMember({ type: "object", fields: [
          defineField({ name: "title", type: "string" }), defineField({ name: "category", type: "string" }), defineField({ name: "href", title: "Link", type: "string" }),
          defineField({ name: "image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] }),
        ], preview: { select: { title: "title", subtitle: "category", media: "image" } } })] }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
