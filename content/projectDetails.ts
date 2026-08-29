import { portfolioProjects } from "@/content/projects";

export type ProjectStorySection = {
  title: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  layout: "image-left" | "image-right" | "wide";
};

export type ProjectDetail = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  introduction: string;
  heroImageUrl: string;
  heroImageAlt: string;
  facts: { label: string; value: string }[];
  sections: ProjectStorySection[];
  gallery: { imageUrl: string; imageAlt: string }[];
};

export const projectDetails: ProjectDetail[] = [
  {
    slug: "ge-digital",
    title: "GE Digital",
    eyebrow: "Featured project",
    summary: "Inspired by the dynamism of urban environments",
    introduction: "Inspired by urban spaces and grouped activities, we design workplace experiences that spark creativity, enable learning, and drive performance.",
    heroImageUrl: "/images/home/project-ge-digital.jpg",
    heroImageAlt: "GE Digital workplace with yellow collaboration pods",
    facts: [
      { label: "Project Name", value: "GE Digital" },
      { label: "Project Location", value: "Bengaluru, India" },
      { label: "Space Typology", value: "Workplace Interior" },
      { label: "Year Built", value: "2017" },
    ],
    sections: [
      {
        title: "Focus on elevated user experience",
        body: "When GE Digital, a major innovation division of GE, decided to consolidate their offices in Bengaluru, they wanted their new workplace to reflect the energy of a fast-moving, collaborative team. We created a layered environment with open work zones, social spaces, and intuitive circulation that keeps people connected throughout the day.",
        imageUrl: "/images/home/service-interiors.jpg",
        imageAlt: "Warm social hub and elevated workplace experience",
        layout: "image-left",
      },
      {
        title: "Blend of contrasting aesthetics and systems",
        body: "One of the defining qualities of the workplace is the dialogue between refined finishes and exposed services. Dark ceilings, vivid furniture and precisely detailed joinery create a confident visual identity while supporting the practical demands of a flexible technology workplace.",
        imageUrl: "/images/home/project-ge-digital.jpg",
        imageAlt: "Lounge with contrasting yellow seating and a dark ceiling",
        layout: "wide",
      },
      {
        title: "Designs that support strategic organizational goals",
        body: "The experience of GE Digital is anchored by bright communal spaces and quieter focus areas. Adaptable settings, clear wayfinding, and a rhythm of collaborative zones help teams move easily between individual and shared work.",
        imageUrl: "/images/home/project-hilton.jpg",
        imageAlt: "Colourful workplace meeting room and informal seating",
        layout: "image-right",
      },
    ],
    gallery: [
      { imageUrl: "/images/home/project-avalahalli.jpg", imageAlt: "Open collaborative work area" },
      { imageUrl: "/images/home/lab-social.jpg", imageAlt: "People collaborating around a work table" },
      { imageUrl: "/images/home/service-interiors.jpg", imageAlt: "Contemporary workplace interior" },
    ],
  },
];

export function getProjectDetail(slug: string) {
  const authoredProject = projectDetails.find((project) => project.slug === slug);
  if (authoredProject) return authoredProject;

  const project = portfolioProjects.find((item) => item.slug === slug);
  if (!project) return undefined;

  return {
    slug: project.slug,
    title: project.featuredTitle ?? project.title,
    eyebrow: project.category,
    summary: `${project.type} shaped by its setting`,
    introduction: `Located in ${project.location}, ${project.title} reflects our considered approach to ${project.type.toLowerCase()}, balancing character, function, and a strong sense of place.`,
    heroImageUrl: project.imageUrl,
    heroImageAlt: project.imageAlt,
    facts: [
      { label: "Project Name", value: project.featuredTitle ?? project.title },
      { label: "Project Location", value: project.location },
      { label: "Project Type", value: project.type },
      { label: "Project Period", value: project.year },
    ],
    sections: [],
    gallery: [],
  } satisfies ProjectDetail;
}
