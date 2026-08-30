import { defineArrayMember, defineField, defineType } from "sanity";

export const servicesPage = defineType({
  name: "servicesPage", title: "Services page", type: "document",
  groups: [{ name: "hero", title: "Hero", default: true }, { name: "process", title: "Process" }, { name: "services", title: "Services" }, { name: "projects", title: "Projects" }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "heroTitle", type: "text", rows: 2, group: "hero", initialValue: "Experience\nfocused design.", validation: (r) => r.required() }),
    defineField({ name: "heroImage", type: "image", group: "hero", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })], validation: (r) => r.required() }),
    defineField({ name: "processEyebrow", type: "string", group: "process", initialValue: "Process" }),
    defineField({ name: "processHeading", type: "text", rows: 3, group: "process", validation: (r) => r.required() }),
    defineField({ name: "processSteps", type: "array", group: "process", validation: (r) => r.max(4), of: [defineArrayMember({ type: "object", fields: [defineField({ name: "number", type: "string" }), defineField({ name: "title", type: "string", validation: (r) => r.required() }), defineField({ name: "subtitle", type: "string" }), defineField({ name: "deliverables", type: "array", of: [{ type: "string" }] })], preview: { select: { title: "title", subtitle: "number" } } })] }),
    defineField({ name: "servicesEyebrow", type: "string", group: "services", initialValue: "What we do" }),
    defineField({ name: "servicesHeading", type: "text", rows: 2, group: "services", initialValue: "Our\nServices." }),
    defineField({ name: "services", type: "array", group: "services", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "mark", type: "string" }), defineField({ name: "title", type: "string", validation: (r) => r.required() }), defineField({ name: "description", type: "text", rows: 4 }), defineField({ name: "items", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", type: "string", validation: (r) => r.required() }), defineField({ name: "description", type: "text", rows: 3 }), defineField({ name: "image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] })], preview: { select: { title: "title", media: "image" } } })] })], preview: { select: { title: "title", subtitle: "mark" } } })] }),
    defineField({ name: "featuredProjects", type: "array", group: "projects", of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })], validation: (r) => r.max(6).unique() }),
    defineField({ name: "seo", type: "object", group: "seo", fields: [defineField({ name: "title", type: "string", validation: (r) => r.max(70) }), defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.max(160) }), defineField({ name: "image", type: "image", options: { hotspot: true } })] }),
  ], preview: { prepare: () => ({ title: "Services page" }) },
});

