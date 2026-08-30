import { defineField, defineType } from "sanity";

export const clientsPage = defineType({
  name: "clientsPage", title: "Clients page", type: "document",
  groups: [{ name: "hero", title: "Hero", default: true }, { name: "index", title: "Index" }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "countLabel", type: "string", group: "hero", initialValue: "150+" }),
    defineField({ name: "heroTitle", type: "text", rows: 2, group: "hero", initialValue: "Private &\nPublic Clients", validation: (r) => r.required() }),
    defineField({ name: "heroImage", type: "image", group: "hero", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })], validation: (r) => r.required() }),
    defineField({ name: "indexTitle", type: "string", group: "index", initialValue: "Index" }),
    defineField({ name: "searchPlaceholder", type: "string", group: "index", initialValue: "Search clients" }),
    defineField({ name: "loadMoreLabel", type: "string", group: "index", initialValue: "Load more" }),
    defineField({ name: "seo", type: "object", group: "seo", fields: [defineField({ name: "title", type: "string", validation: (r) => r.max(70) }), defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.max(160) }), defineField({ name: "image", type: "image", options: { hotspot: true } })] }),
  ], preview: { prepare: () => ({ title: "Clients page" }) },
});

