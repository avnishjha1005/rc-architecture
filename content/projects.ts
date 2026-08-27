import type { ProjectItem } from "@/content/home";

export type PortfolioProject = ProjectItem & {
  id: number;
  location: string;
  type: "Architecture" | "Interior Design";
};

const projectSeeds = [
  { title: "Soho Lakehouse", category: "Commercial", location: "Auckland, New Zealand", year: "2019–2020", type: "Architecture" as const, imageUrl: "/images/home/project-bale-county.jpg", imageAlt: "Contemporary lakehouse surrounded by native landscaping" },
  { title: "Sandstone Residence", category: "Civic & Cultural", location: "California, USA", year: "2021–2022", type: "Architecture" as const, imageUrl: "/images/home/service-architecture.jpg", imageAlt: "Warm contemporary sandstone residence" },
  { title: "Desert Oasis", category: "Educational", location: "Utah, USA", year: "2022–2023", type: "Architecture" as const, imageUrl: "/images/home/project-avalahalli.jpg", imageAlt: "Low modern house opening onto a garden" },
  { title: "Midnight Haven", category: "Residential", location: "Lofoten Islands, Norway", year: "2004–2006", type: "Interior Design" as const, imageUrl: "/images/home/project-hilton.jpg", imageAlt: "Minimal white house with tropical planting" },
  { title: "Concrete Annex", category: "Commercial", location: "Basel, Switzerland", year: "2018–2020", type: "Architecture" as const, imageUrl: "/images/home/project-ge-digital.jpg", imageAlt: "Compact contemporary annex beneath mature trees" },
  { title: "Coast Retreat", category: "Competitions / Unbuilt", location: "Andalusia, Spain", year: "1999–2001", type: "Interior Design" as const, imageUrl: "/images/home/project-bale-county.jpg", imageAlt: "Modern coastal courtyard residence" },
];

export const portfolioProjects: PortfolioProject[] = Array.from({ length: 24 }, (_, index) => {
  const seed = projectSeeds[index % projectSeeds.length];
  const cycle = Math.floor(index / projectSeeds.length);
  const alternateImages = [
    "/images/home/project-bale-county.jpg",
    "/images/home/service-architecture.jpg",
    "/images/home/project-avalahalli.jpg",
    "/images/home/project-hilton.jpg",
    "/images/home/project-ge-digital.jpg",
    "/images/home/service-interiors.jpg",
  ];

  return {
    ...seed,
    id: index + 1,
    title: cycle === 0 ? seed.title : `${seed.title} ${String(cycle + 1).padStart(2, "0")}`,
    imageUrl: alternateImages[(index + cycle) % alternateImages.length],
    href: "#contact",
  };
});

export const projectNavigation = [
  { label: "Projects", href: "/projects" },
  { label: "Space Labs & Space Making", href: "/#space-labs" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Clients", href: "/#clients" },
  { label: "Contact", href: "#contact" },
];
