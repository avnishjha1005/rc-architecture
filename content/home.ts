export type LinkItem = { label: string; href: string };
export type NavigationItem = LinkItem;
export type Stat = { value: string; label: string };
export type ImageItem = { imageUrl: string; imageAlt: string };
export type Ideology = { title: string; description: string };
export type Service = ImageItem & { number: string; title: string; description: string; features: string[] };
export type ProjectItem = ImageItem & { title: string; category: string; year: string; href: string };
export type ArticleItem = ImageItem & { title: string; category: string; href: string };

export type HomeContent = {
  brandName: string; navigation: LinkItem[]; cta: LinkItem;
  heroImageUrl: string; heroImageAlt: string; headlineTop: string; headlineAccent: string; headlineEnd: string; intro: string; stats: Stat[];
  about: { eyebrow: string; title: string; description: string; cta: LinkItem; ideologiesLabel: string; ideologies: Ideology[] };
  services: { eyebrow: string; title: string; intro: string; cta: LinkItem; items: Service[] };
  projects: { eyebrow: string; title: string; intro: string; cta: LinkItem; items: ProjectItem[] };
  labs: { eyebrow: string; intro: string; cta: LinkItem; articles: ArticleItem[] };
  contact: { eyebrow: string; title: string; description: string; cta: LinkItem; imageUrl: string; imageAlt: string };
  newsletter: { eyebrow: string; title: string; description: string; placeholder: string; buttonLabel: string; imageUrl: string };
  footer: { eyebrow: string; title: string; email: string; blurb: string; addressLabel: string; address: string; phone: string; hoursLabel: string; hours: string; legal: string; navigation: LinkItem[] };
};

const navigation: LinkItem[] = [
  { label: "Projects", href: "#projects" }, { label: "Space Labs & Space Making", href: "#space-labs" },
  { label: "About", href: "#about" }, { label: "Services", href: "#services" },
  { label: "Clients", href: "#clients" }, { label: "Contact", href: "#contact" },
];

export const fallbackHomeContent: HomeContent = {
  brandName: "RC Architecture", navigation, cta: { label: "Get in touch", href: "#contact" },
  heroImageUrl: "/rc-studio-hero.png", heroImageAlt: "A warm contemporary architecture studio with timber screens and glass meeting rooms",
  headlineTop: "Let’s Go", headlineAccent: "space", headlineEnd: "making",
  intro: "We’re a Bangalore-based design studio crafting high-impact spaces with purpose. We balance bold creativity with a conscious use of time, money, and materials.",
  stats: [{ value: "100+", label: "clients\nglobally" }, { value: "500+", label: "projects\ncompleted" }, { value: "50+", label: "million sqft\ndesigned" }, { value: "30+", label: "awards\nreceived" }],
  about: {
    eyebrow: "About us", title: "We are Idea\nFarmers.",
    description: "A collective of architects, designers, and specialists growing bold ideas through collaboration, equality, and future-thinking.",
    cta: { label: "Know more", href: "#about" }, ideologiesLabel: "Our ideologies",
    ideologies: [
      { title: "Environment", description: "We do not look at sustainability as something applied on a building. We believe that sustainability should be in the DNA." },
      { title: "Emotion", description: "We value culture, tradition, history and the emotion underlying every project. This has created environments which are sensitive to human behaviour, culture and technology." },
      { title: "Economy", description: "Value for money, design, the client, the environment. We understand the importance of economy and how to stretch it." },
      { title: "Evolve", description: "Design is ever evolving, and so is technology. That is why we intend to keep up with innovation to bring out the best facilities for our clients." },
    ],
  },
  services: {
    eyebrow: "Our services", title: "Explore Our\nServices.", intro: "Explore our services and see how we bring creativity and expertise to every project.", cta: { label: "Know more", href: "#services" },
    items: [
      { number: "01", title: "Architectural Design", description: "Every iconic building starts with a brilliant idea, and that’s where architectural design takes center stage.", features: ["Site Planning", "Layout Design", "3D Visualization", "Rendering"], imageUrl: "/images/home/service-architecture.jpg", imageAlt: "Contemporary concrete residence" },
      { number: "02", title: "Interior Design", description: "Every iconic building starts with a brilliant idea, and that’s where architectural design takes center stage.", features: ["Site Planning", "Layout Design", "3D Visualization", "Rendering"], imageUrl: "/images/home/service-interiors.jpg", imageAlt: "Contemporary office interior" },
    ],
  },
  projects: {
    eyebrow: "Featured projects", title: "Our Latest\nProjects.", intro: "Explore our services and see how we bring creativity and expertise to every project.", cta: { label: "View all projects", href: "#projects" },
    items: [
      { title: "GE Digital", category: "Interior", year: "2016", href: "#", imageUrl: "/images/home/project-ge-digital.jpg", imageAlt: "GE Digital collaboration area" },
      { title: "Avalahalli", category: "Architecture", year: "2020", href: "#", imageUrl: "/images/home/project-avalahalli.jpg", imageAlt: "Avalahalli warm timber interior" },
      { title: "Hilton Conrad", category: "Interior", year: "2013", href: "#", imageUrl: "/images/home/project-hilton.jpg", imageAlt: "Hilton Conrad guest room" },
      { title: "Bale County", category: "Architecture", year: "2023", href: "#", imageUrl: "/images/home/project-bale-county.jpg", imageAlt: "Bale County pool house" },
    ],
  },
  labs: {
    eyebrow: "Space labs", intro: "Explore our services and see how we bring creativity and expertise to every project.", cta: { label: "View all", href: "#space-labs" },
    articles: [
      { category: "Contemporary Architecture", title: "Designing For Tomorrow: How Sustainable Architecture Shapes The Future", href: "#", imageUrl: "/images/home/lab-sustainable.jpg", imageAlt: "Curved contemporary architecture" },
      { category: "Interior Design", title: "Beyond Aesthetics: The Role Of Architecture In Social Impact And Community Building", href: "#", imageUrl: "/images/home/lab-social.jpg", imageAlt: "Designers collaborating in a studio" },
      { category: "Corporate Architecture", title: "The Art Of Minimalism: Designing Spaces That Do More With Less", href: "#", imageUrl: "/images/home/lab-minimalism.jpg", imageAlt: "Minimalist editorial composition" },
      { category: "Design & Build", title: "From Concept To Construction: What Goes Into Designing A Modern Building", href: "#", imageUrl: "/images/home/lab-design-build.jpg", imageAlt: "Blue presentation graphic" },
    ],
  },
  contact: { eyebrow: "Contact us", title: "Get in touch\nwith us for projects.", description: "We design spaces for people. No matter the scale of the projects, our down-to-earth approach stays the same.", cta: { label: "Contact us", href: "mailto:info@rapidcorpindia.com" }, imageUrl: "/images/home/service-interiors.jpg", imageAlt: "RC Architecture office corridor" },
  newsletter: { eyebrow: "Newsletter", title: "Subscribe to\nour newsletter.", description: "We design spaces for people. No matter the scale of the projects, our down-to-earth approach stays the same.", placeholder: "Enter your email address...", buttonLabel: "Subscribe", imageUrl: "/images/home/newsletter-drawing.png" },
  footer: {
    eyebrow: "Contact us", title: "Materialise\nyour vision.", email: "info@rapidcorpindia.com",
    blurb: "As a relationship-focused organisation, RC Architecture looks forward to a journey of creation and mutual success.",
    addressLabel: "Address", address: "16, Serpentine St, Richmond Town, Bengaluru, Karnataka 560025", phone: "Tel: +91 80 4937 8800",
    hoursLabel: "Opening Hours", hours: "8.30am to 6.00pm.\nMonday to Friday.\nWeekends by appointment.",
    legal: "RC Architecture Pvt Ltd\nACN 676 445 195   ABN 41 676 445 195\n© 2025. RC Architecture. All rights reserved.", navigation,
  },
};
