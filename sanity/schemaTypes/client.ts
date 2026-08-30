import { defineField, defineType } from "sanity";

export const client = defineType({
  name: "client", title: "Client", type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "category", type: "string", options: { list: ["Architecture", "Commercial & Retail", "Hospitality", "Interior", "R&D"] }, validation: (r) => r.required() }),
    defineField({ name: "year", type: "number", validation: (r) => r.integer().min(1900).max(2100) }),
    defineField({ name: "order", type: "number", description: "Optional manual sort order.", validation: (r) => r.integer().min(0) }),
  ],
  orderings: [{ title: "Name", name: "nameAsc", by: [{ field: "name", direction: "asc" }] }, { title: "Manual order", name: "manual", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", category: "category", year: "year" }, prepare: ({ title, category, year }) => ({ title, subtitle: [category, year].filter(Boolean).join(" · ") }) },
});

