import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_id == "siteSettings"][0]{
    "brandName": title,
    email,
    phone,
    address,
    hours,
    navigation[]{label, href},
    cta{label, href},
    offices[]{city, address, phone},
    socialLinks[]{label, "href": url, shortLabel},
    contact{eyebrow, title, description, cta{label, href}, "imageUrl": image.asset->url, "imageAlt": image.alt},
    newsletter{eyebrow, title, description, placeholder, buttonLabel, "imageUrl": image.asset->url},
    footer{eyebrow, title, blurb, addressLabel, hoursLabel, legal}
  }
`);

export const homePageQuery = defineQuery(`{
  "home": coalesce(
    *[_id == "homePage"][0],
    *[_type == "homePage"] | order(_updatedAt desc)[0]
  ){
    heroImage,
    "heroImageAlt": heroImage.alt,
    headlineTop,
    headlineAccent,
    headlineEnd,
    intro,
    stats[]{value, label},
    about{eyebrow, title, description, cta{label, href}, ideologiesLabel, ideologies[]{title, description}},
    services{eyebrow, title, intro, cta{label, href}, items[]{number, title, description, features, "imageUrl": image.asset->url, "imageAlt": image.alt}},
    projects{eyebrow, title, intro, cta{label, href}, items[]{title, category, year, href, "imageUrl": image.asset->url, "imageAlt": image.alt}},
    labs{eyebrow, intro, cta{label, href}, articles[]{title, category, href, "imageUrl": image.asset->url, "imageAlt": image.alt}}
  }
}`)

const projectCardProjection = `{
  _id,
  title,
  featuredTitle,
  "slug": slug.current,
  "type": discipline,
  category,
  location,
  "yearDisplay": coalesce(yearRange, string(year)),
  "imageUrl": coverImage.asset->url,
  "imageAlt": coverImage.alt
}`;

export const projectsPageQuery = defineQuery(`{
  "page": coalesce(
    *[_id == "projectsPage"][0],
    *[_type == "projectsPage"] | order(_updatedAt desc)[0]
  ){
    featuredHeading,
    featuredIntro,
    featuredYearRange,
    "featuredProjects": featuredProjects[]->${projectCardProjection},
    archiveEyebrow,
    archiveHeading,
    archiveIntro,
    "archiveProjects": archiveProjects[]->${projectCardProjection},
    loadMoreLabel,
    seo
  },
  "featuredFlagged": *[_type == "project" && featured == true]
    | order(year desc, title asc)[0...5]${projectCardProjection},
  "allProjects": *[_type == "project"]
    | order(year desc, title asc)${projectCardProjection}
}`);

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    featuredTitle,
    "slug": slug.current,
    discipline,
    category,
    location,
    "yearDisplay": coalesce(yearRange, string(year)),
    excerpt,
    "heroImageUrl": coverImage.asset->url,
    "heroImageAlt": coverImage.alt,
    "gallery": gallery[]{
      "imageUrl": asset->url,
      "imageAlt": alt
    },
    "relatedProjects": relatedProjects[]->${projectCardProjection}
  }
`);
