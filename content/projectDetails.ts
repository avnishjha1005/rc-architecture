import { portfolioProjects } from "@/content/projects";
import { legacyImage, type ResponsiveImage } from "@/lib/responsive-image";

export type ProjectStorySection = {
  title: string;
  body: string;
  image: ResponsiveImage;
  layout: "image-left" | "image-right" | "wide";
};

export type ProjectDetail = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  introduction: string;
  heroImage: ResponsiveImage;
  facts: { label: string; value: string }[];
  sections: ProjectStorySection[];
  gallery: ResponsiveImage[];
};

export const projectDetails: ProjectDetail[] = [
  {
    slug: "ge-digital",
    title: "GE Digital",
    eyebrow: "Featured project",
    summary: "Inspired by the dynamism of urban environments",
    introduction: "Inspired by urban spaces and grouped activities, we design workplace experiences that spark creativity, enable learning, and drive performance.",
    heroImage: legacyImage("/images/home/project-ge-digital.jpg", "GE Digital workplace with yellow collaboration pods"),
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
        image: legacyImage("/images/home/service-interiors.jpg", "Warm social hub and elevated workplace experience"),
        layout: "image-left",
      },
      {
        title: "Blend of contrasting aesthetics and systems",
        body: "One of the defining qualities of the workplace is the dialogue between refined finishes and exposed services. Dark ceilings, vivid furniture and precisely detailed joinery create a confident visual identity while supporting the practical demands of a flexible technology workplace.",
        image: legacyImage("/images/home/project-ge-digital.jpg", "Lounge with contrasting yellow seating and a dark ceiling"),
        layout: "wide",
      },
      {
        title: "Designs that support strategic organizational goals",
        body: "The experience of GE Digital is anchored by bright communal spaces and quieter focus areas. Adaptable settings, clear wayfinding, and a rhythm of collaborative zones help teams move easily between individual and shared work.",
        image: legacyImage("/images/home/project-hilton.jpg", "Colourful workplace meeting room and informal seating"),
        layout: "image-right",
      },
    ],
    gallery: [
      legacyImage("/images/home/project-avalahalli.jpg", "Open collaborative work area"),
      legacyImage("/images/home/lab-social.jpg", "People collaborating around a work table"),
      legacyImage("/images/home/service-interiors.jpg", "Contemporary workplace interior"),
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
    heroImage: project.image || legacyImage(project.imageUrl, project.imageAlt),
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
