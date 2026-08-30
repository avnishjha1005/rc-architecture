export type BlogSection = {
  title: string;
  body: string[];
  bullets?: string[];
  imageUrl?: string;
  imageAlt?: string;
  quote?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
  excerpt: string;
  sections: BlogSection[];
};

const sharedSections: BlogSection[] = [
  {
    title: "Design begins with who you are",
    body: [
      "A well-designed home is built around the people who live there. The best interiors respond to everyday habits, personal rituals, and the details that make a space feel unmistakably yours.",
      "It is not about perfection — it is about presence. Your home should feel like an extension of you: lived-in, layered, and full of meaning.",
    ],
  },
  {
    title: "Start with how you live",
    body: ["Before selecting paint colours or furniture, look inward. How do you move through your day? What spaces bring you peace? What corners of your home feel neglected — and why?"],
    bullets: ["Observe your daily rhythms", "Note moments of comfort or frustration", "Define how you want your space to feel, not just how it looks"],
    imageUrl: "/images/home/project-hilton.jpg",
    imageAlt: "A warm, calm bedroom interior",
    quote: "Once I focused on how I actually lived — not just what I thought I liked — the design came together naturally.",
  },
  {
    title: "Let your personality guide your palette",
    body: [
      "You do not need to follow a style rulebook to create a beautiful space. Your favourite colours, textures, and materials are already enough. Whether that is earth tones and soft linen or bold prints and rich contrast, your design choices should echo your energy.",
      "There is power in knowing what feels right to you — and even more in bringing that into your environment. The result will not just be a stylish home. It will be a space that feels lived in, loved, and unmistakably yours.",
    ],
    imageUrl: "/images/home/project-ge-digital.jpg",
    imageAlt: "Characterful contemporary lounge seating",
  },
];

const seeds = [
  ["how-to-design-a-home-that-reflects-you", "How to design a home that reflects you", "Interior Design", "/images/home/service-interiors.jpg", "A bright contemporary living room"],
  ["designing-for-tomorrow", "Designing For Tomorrow: How Sustainable Architecture Shapes The Future", "Contemporary Architecture", "/images/home/lab-sustainable.jpg", "Curved sustainable architecture"],
  ["architecture-and-social-impact", "Beyond Aesthetics: The Role Of Architecture In Social Impact And Community Building", "Interior Design", "/images/home/lab-social.jpg", "Designers collaborating in a studio"],
  ["the-art-of-minimalism", "The Art Of Minimalism: Designing Spaces That Do More With Less", "Corporate Architecture", "/images/home/lab-minimalism.jpg", "Minimal editorial design composition"],
  ["from-concept-to-construction", "From Concept To Construction: What Goes Into Designing A Modern Building", "Design & Build", "/images/home/lab-design-build.jpg", "Blue graphic presentation artwork"],
  ["inside-the-studio", "Inside The Studio: Our Design Process Explained", "Commercial Architecture", "/images/about/studio-kitchen.png", "Material studies in the RC Architecture studio"],
  ["transforming-spaces", "Transforming Spaces: A Closer Look At Our Latest Residential Project", "Hospitality Design", "/images/home/project-bale-county.jpg", "Contemporary residence beside a pool"],
  ["top-architecture-trends", "Top 5 Architecture Trends Shaping 2025 And Beyond", "Design & Build", "/images/home/service-architecture.jpg", "Contemporary architectural facade"],
  ["smart-design", "Smart Design: Integrating Technology In Contemporary Architecture", "Interior Design", "/images/home/project-avalahalli.jpg", "Warm timber-lined contemporary interior"],
] as const;

export const blogPosts: BlogPost[] = seeds.map(([slug, title, category, imageUrl, imageAlt], index) => ({
  slug,
  title,
  category,
  imageUrl,
  imageAlt,
  date: index === 0 ? "April 14, 2025" : `${String((index * 3) % 27 + 1).padStart(2, "0")} June, 2025`,
  excerpt: "Ideas, observations, and practical lessons from our architecture and design studio.",
  sections: sharedSections,
}));

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

