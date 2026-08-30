import { defineArrayMember, defineField, defineType } from "sanity";

export const blogPage = defineType({
  name: "blogPage", title: "Blog page", type: "document",
  groups: [{ name: "hero", title: "Hero", default: true }, { name: "listing", title: "Listing" }, { name: "projects", title: "Projects" }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "heroTitle", type: "text", rows: 2, group: "hero", initialValue: "In the\nSpotlight.", validation: (r) => r.required() }),
    defineField({ name: "heroIntro", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "primaryTabLabel", type: "string", group: "listing", initialValue: "Space Labs" }),
    defineField({ name: "secondaryTabLabel", type: "string", group: "listing", initialValue: "Space Making" }),
    defineField({ name: "featuredPosts", type: "array", group: "listing", description: "Optional manual ordering. Leave empty to show all published posts newest first.", of: [defineArrayMember({ type: "reference", to: [{ type: "blogPost" }] })], validation: (r) => r.unique() }),
    defineField({ name: "featuredProjects", type: "array", group: "projects", of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })], validation: (r) => r.max(6).unique() }),
    defineField({ name: "seo", type: "object", group: "seo", fields: [defineField({ name: "title", type: "string", validation: (r) => r.max(70) }), defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.max(160) }), defineField({ name: "image", type: "image", options: { hotspot: true } })] }),
  ], preview: { prepare: () => ({ title: "Blog page" }) },
});

