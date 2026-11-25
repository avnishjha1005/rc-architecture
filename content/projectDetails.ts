import { portfolioProjects } from "@/content/projects";
import { legacyImage, type ResponsiveImage } from "@/lib/responsive-image";

export type ProjectStorySection = {
  title: string;
  body: string;
  image: ResponsiveImage;
  mobileImageUrl?: string;
  layout: "image-left" | "image-right" | "wide";
};

export type ProjectDetail = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  introduction: string;
  heroImage: ResponsiveImage;
  mobileHeroUrl?: string;
  facts: { label: string; value: string }[];
  sections: ProjectStorySection[];
  gallery: ResponsiveImage[];
};

export const projectDetails: ProjectDetail[] = [
  {
    slug: "ge-digital",
    title: "GE Digital",
    eyebrow: "Corporate Technology",
    summary: "Inspired by the dynamism of urban environments",
    introduction: "Inspired by urban spaces and grunge aesthetics, we design adaptive workplaces that spark creativity, enable learning, and drive performance.",
    heroImage: legacyImage("/images/home/project-ge-digital.jpg", "GE Digital workplace with yellow collaboration pods"),
    facts: [
      { label: "Project Name", value: "GE Digital" },
      { label: "Project Location", value: "Bangalore, India" },
      { label: "Square Footage", value: "240,000 sq.ft." },
      { label: "Year Build", value: "2017" },
    ],
    sections: [
      {
        title: "Focus on elevated user experience",
        body: "When GE Digital, a newly formed division in GE, decided to consolidate their offices at Bangalore, they wanted the office to symbolize their vision and their journey forward.\n\nWe created a living office which is a high-performing workplace, that delivers an elevated experience of work for people and helps them achieve their strategic goals. One is free to decide the way they work and the place they work from. The office floor has different work environments from collaborative settings to individual spaces. The 20,000 SQM office space spread over 7 floors, with a capacity of 1500 plus employees has been designed to create a workplace that inculcates creativity and also promotes a fun & learning environment.",
        image: legacyImage("/images/home/service-interiors.jpg", "Warm social hub and elevated workplace experience"),
        layout: "image-left",
      },
      {
        title: "Blend of contrasting aesthetics and systems",
        body: "One of the observations of the existing GE offices was that the collaboration areas worked well when the group collaborating had a sense of privacy. The office floor space has designated zones called the living rooms where the essence of a living room was created. The space has movable privacy screens and mobile writing boards which can be moved around to achieve the desired level of privacy any group wants.",
        image: legacyImage("/images/home/project-ge-digital.jpg", "Lounge with contrasting yellow seating and a dark ceiling"),
        layout: "image-right",
      },
      {
        title: "Designs that support strategic organizational goals",
        body: "The dynamism of ‘Urban Grunge’ is achieved by high contrast in all elements of design be it material selection, workplaces, lighting, ceilings, and the flooring.",
        image: legacyImage("/images/home/project-hilton.jpg", "Colourful workplace meeting room and informal seating"),
        layout: "wide",
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
