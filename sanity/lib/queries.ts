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
    detailEyebrow,
    summary,
    introduction,
    facts[]{label, value},
    storySections[]{title, body, layout, "imageUrl": image.asset->url, "imageAlt": image.alt},
    "heroImageUrl": coverImage.asset->url,
    "heroImageAlt": coverImage.alt,
    "gallery": gallery[]{
      "imageUrl": asset->url,
      "imageAlt": alt
    },
    "relatedProjects": relatedProjects[]->${projectCardProjection}
  }
`);

export const aboutPageQuery = defineQuery(`
  coalesce(*[_id == "aboutPage"][0], *[_type == "aboutPage"] | order(_updatedAt desc)[0]){
    heroTitle, "heroImageUrl": heroImage.asset->url, "heroImageAlt": heroImage.alt,
    introEyebrow, introHeading, introParagraphs,
    "introImages": introImages[]{"imageUrl": asset->url, "imageAlt": alt},
    stats[]{label, value}, philosophyEyebrow, philosophyHeading, philosophyIntro,
    principles[]{title, description}, clientsEyebrow, clientsHeading, clientsIntro, clientNames,
    peopleEyebrow, peopleHeading, "people": people[]{name, role, "imageUrl": image.asset->url, "imageAlt": image.alt},
    awardsEyebrow, awardsHeading, awardsIntro, awards[]{project, award, year},
    careersEyebrow, valuesHeading, valuesIntro, values[]{icon, title, description}, seo
  }
`);

export const servicesPageQuery = defineQuery(`
  coalesce(*[_id == "servicesPage"][0], *[_type == "servicesPage"] | order(_updatedAt desc)[0]){
    heroTitle, "heroImageUrl": heroImage.asset->url, "heroImageAlt": heroImage.alt,
    processEyebrow, processHeading, processSteps[]{number, title, subtitle, deliverables},
    servicesEyebrow, servicesHeading,
    "services": services[]{mark, title, description, "items": items[]{title, description, "imageUrl": image.asset->url, "imageAlt": image.alt}},
    "featuredProjects": featuredProjects[]->${projectCardProjection}, seo
  }
`);

export const clientsPageQuery = defineQuery(`{
  "page": coalesce(*[_id == "clientsPage"][0], *[_type == "clientsPage"] | order(_updatedAt desc)[0]){
    countLabel, heroTitle, "heroImageUrl": heroImage.asset->url, "heroImageAlt": heroImage.alt,
    indexTitle, loadMoreLabel, seo
  },
  "clients": *[_type == "client"] | order(coalesce(order, 999999) asc, name asc){name, category, year}
}`);

export const contactPageQuery = defineQuery(`
  coalesce(*[_id == "contactPage"][0], *[_type == "contactPage"] | order(_updatedAt desc)[0]){
    heroTitle, heroIntro, "heroImageUrl": heroImage.asset->url, "heroImageAlt": heroImage.alt,
    infoEyebrow, infoHeading, infoIntro, phoneLabel, emailLabel, mainOfficeLabel,
    mapUrl,
    satelliteOfficesHeading, socialLabel, careersEyebrow, seo
  }
`);

const blogPostProjection = `{
  _id, title, "slug": slug.current, category, "blogCategory": coalesce(blogCategory, "spaceLabs"), publishedAt, excerpt,
  "imageUrl": coverImage.asset->url, "imageAlt": coverImage.alt,
  "sections": sections[]{title, "body": paragraphs, bullets, "imageUrl": image.asset->url, "imageAlt": image.alt, quote}
}`;

export const blogPageQuery = defineQuery(`{
  "page": coalesce(*[_id == "blogPage"][0], *[_type == "blogPage"] | order(_updatedAt desc)[0]){
    heroTitle, heroIntro, primaryTabLabel, secondaryTabLabel,
    "featuredPosts": featuredPosts[]->${blogPostProjection},
    "featuredProjects": featuredProjects[]->${projectCardProjection}, seo
  },
  "allPosts": *[_type == "blogPost"] | order(publishedAt desc)${blogPostProjection}
}`);

export const blogPostBySlugQuery = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0]{
    ${blogPostProjection.slice(1, -1)},
    "relatedPosts": relatedPosts[]->${blogPostProjection}
  }
`);
