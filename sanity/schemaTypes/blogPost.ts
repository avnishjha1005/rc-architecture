import { defineArrayMember, defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost", title: "Blog post", type: "document",
  groups: [{ name: "content", title: "Content", default: true }, { name: "related", title: "Related" }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", group: "content", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "category", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "publishedAt", type: "datetime", group: "content", validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3, group: "content", validation: (r) => r.max(220) }),
    defineField({ name: "coverImage", type: "image", group: "content", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })], validation: (r) => r.required() }),
    defineField({ name: "sections", type: "array", group: "content", of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "title", type: "string", validation: (r) => r.required() }),
      defineField({ name: "paragraphs", type: "array", of: [{ type: "text", rows: 4 }] }),
      defineField({ name: "bullets", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] }),
      defineField({ name: "quote", type: "text", rows: 3 }),
    ], preview: { select: { title: "title", media: "image" } } })] }),
    defineField({ name: "relatedPosts", type: "array", group: "related", of: [defineArrayMember({ type: "reference", to: [{ type: "blogPost" }] })], validation: (r) => r.max(6).unique() }),
    defineField({ name: "seo", type: "object", group: "seo", fields: [defineField({ name: "title", type: "string", validation: (r) => r.max(70) }), defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.max(160) }), defineField({ name: "image", type: "image", options: { hotspot: true } })] }),
  ],
  orderings: [{ title: "Published, newest", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", category: "category", date: "publishedAt", media: "coverImage" }, prepare: ({ title, category, date, media }) => ({ title, subtitle: [category, date ? new Date(date).toLocaleDateString() : ""].filter(Boolean).join(" · "), media }) },
});

