import { defaultSiteData, siteFooter, type ContactSectionData, type NewsletterSectionData, type SiteFooterContent } from "@/content/site";
import type { ResponsiveImage } from "@/lib/responsive-image";
import type { SanityImageSource } from "@sanity/image-url";

export type LinkItem = { label: string; href: string };
export type NavigationItem = LinkItem;
export type Stat = { value: string; label: string };
export type ImageItem = { imageUrl: string; imageAlt: string; image?: ResponsiveImage };
export type Ideology = { title: string; description: string };
export type Service = ImageItem & { number: string; title: string; description: string; features: string[] };
export type ProjectItem = ImageItem & { title: string; category: string; year: string; href: string };
export type ArticleItem = ImageItem & { title: string; category: string; href: string };

export type HomeContent = {
  mobileHeroImage?: SanityImageSource;
  brandName: string; navigation: LinkItem[]; cta: LinkItem;
  heroImageUrl: string; heroImageAlt: string; heroImage: ResponsiveImage; headlineTop: string; headlineAccent: string; headlineEnd: string; intro: string; stats: Stat[];
  about: { eyebrow: string; title: string; description: string; cta: LinkItem; ideologiesLabel: string; ideologies: Ideology[] };
  services: { eyebrow: string; title: string; intro: string; cta: LinkItem; items: Service[] };
  projects: { eyebrow: string; title: string; intro: string; cta: LinkItem; items: ProjectItem[] };
  labs: { eyebrow: string; intro: string; cta: LinkItem; articles: ArticleItem[] };
  contact: ContactSectionData;
  newsletter: NewsletterSectionData;
  footer: SiteFooterContent;
};

const navigation: LinkItem[] = defaultSiteData.navigation;

export const fallbackHomeContent: HomeContent = {
  brandName: defaultSiteData.brandName, navigation, cta: defaultSiteData.cta,
  heroImageUrl: "/rc-studio-hero.png", heroImageAlt: "A warm contemporary architecture studio with timber screens and glass meeting rooms",
  heroImage: { src: "/rc-studio-hero.png", alt: "A warm contemporary architecture studio with timber screens and glass meeting rooms", width: 1672, height: 941 },
  headlineTop: "Let’s Go", headlineAccent: "space", headlineEnd: "making",
  intro: "We’re a Bangalore-based design studio crafting high-impact spaces with purpose. We balance bold creativity with a conscious use of time, money, and materials.",
  stats: [{ value: "100+", label: "clients\nglobally" }, { value: "500+", label: "projects\ncompleted" }, { value: "50+", label: "million sqft\ndesigned" }, { value: "30+", label: "awards\nreceived" }],
  about: {
    eyebrow: "About us", title: "We Are Idea\nFarmers",
    description: "A collective of architects, designers, and specialists growing bold ideas through collaboration, equality, and future-thinking.",
    cta: { label: "Know more", href: "/about" }, ideologiesLabel: "Our ideologies",
    ideologies: [
      { title: "Environment", description: "We do not look at sustainability as something applied on a building. We believe that sustainability should be in the DNA." },
      { title: "Emotion", description: "We value culture, tradition, history and the emotion underlying every project. This has created environments which are sensitive to human behaviour, culture and technology." },
      { title: "Economy", description: "Value for money, design, the client, the environment. We understand the importance of economy and how to stretch it." },
      { title: "Evolve", description: "Design is ever evolving, and so is technology. That is why we intend to keep up with innovation to bring out the best facilities for our clients." },
    ],
  },
  services: {
    eyebrow: "Our services", title: "Explore Our\nServices", intro: "Explore our services and see how we bring creativity and expertise to every project.", cta: { label: "Know more", href: "/services" },
    items: [
      { number: "01", title: "Architectural Design", description: "Creating purposeful, contextual spaces that balance design, functionality, sustainability, and the people who experience them.", features: ["Civic & Cultural", "Commercial", "Educational", "Residential", "Competitions & Unbuilt"], imageUrl: "/images/home/service-architecture.jpg", imageAlt: "Contemporary concrete residence" },
      { number: "02", title: "Interior Design", description: "Crafting human-centric interiors that bring together identity, experience, functionality, and thoughtful details to shape meaningful workplaces.", features: ["Corporate", "Hospitality", "Retail", "Design & Build"], imageUrl: "/images/home/service-interiors.jpg", imageAlt: "Contemporary office interior" },
    ],
  },
  projects: {
    eyebrow: "Featured projects", title: "Spaces We’ve\nShaped", intro: "Explore our services and see how we bring creativity and expertise to every project.", cta: { label: "View all projects", href: "/projects" },
    items: [],
  },
  labs: {
    eyebrow: "Space labs", intro: "Explore our services and see how we bring creativity and expertise to every project.", cta: { label: "View all", href: "/blog" },
    articles: [
      { category: "Contemporary Architecture", title: "Designing For Tomorrow: How Sustainable Architecture Shapes The Future", href: "/blogs/designing-for-tomorrow", imageUrl: "/images/home/lab-sustainable.jpg", imageAlt: "Curved contemporary architecture" },
      { category: "Interior Design", title: "Beyond Aesthetics: The Role Of Architecture In Social Impact And Community Building", href: "/blogs/architecture-and-social-impact", imageUrl: "/images/home/lab-social.jpg", imageAlt: "Designers collaborating in a studio" },
      { category: "Corporate Architecture", title: "The Art Of Minimalism: Designing Spaces That Do More With Less", href: "/blogs/the-art-of-minimalism", imageUrl: "/images/home/lab-minimalism.jpg", imageAlt: "Minimalist editorial composition" },
      { category: "Design & Build", title: "From Concept To Construction: What Goes Into Designing A Modern Building", href: "/blogs/from-concept-to-construction", imageUrl: "/images/home/lab-design-build.jpg", imageAlt: "Blue presentation graphic" },
    ],
  },
  contact: defaultSiteData.contact,
  newsletter: defaultSiteData.newsletter,
  footer: siteFooter(defaultSiteData),
};
