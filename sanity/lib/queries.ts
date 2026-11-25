import { defineQuery } from "next-sanity";

const responsiveImageProjection = `{
  "src": asset->url,
  "alt": alt,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  crop,
  hotspot
}`;

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
    contact{eyebrow, title, description, cta{label, href}, image, "imageAlt": image.alt, mobileImage},
    newsletter{eyebrow, title, description, placeholder, buttonLabel, "imageUrl": image.asset->url, "innerImageUrl": innerImage.asset->url},
    footer{eyebrow, title, blurb, addressLabel, city, hoursLabel, legal}
  }
`);

export const homePageQuery = defineQuery(`{
  "home": coalesce(
    *[_id == "homePage"][0],
    *[_type == "homePage"] | order(_updatedAt desc)[0]
  ){
    heroImage,
    "mobileHeroImage": select(defined(mobileHeroImage.asset->url) => mobileHeroImage),
    "heroImageAlt": heroImage.alt,
    "heroImageData": heroImage${responsiveImageProjection},
    headlineTop,
    headlineAccent,
    headlineEnd,
    intro,
    stats[]{value, label},
    about{eyebrow, title, description, cta{label, href}, ideologiesLabel, ideologies[]{title, description}},
    services{eyebrow, title, intro, cta{label, href}, items[]{number, title, description, features, "imageUrl": image.asset->url, "imageAlt": image.alt}},
    projects{eyebrow, title, intro, cta{label, href}, items[]{title, category, year, href, "imageUrl": image.asset->url, "imageAlt": image.alt}},
    labs{eyebrow, intro, cta{label, href}, articles[]{title, category, href, "imageUrl": image.asset->url, "imageAlt": image.alt}}
  },
  "featured": *[_type == "project" && slug.current in $featuredSlugs && defined(coverImage.asset->url)]{
    title, category, "year": coalesce(yearRange, string(year), ""), "slug": slug.current, "href": "/projects/" + slug.current,
    "imageUrl": coverImage.asset->url, "imageAlt": coalesce(coverImage.alt, title), "image": coverImage${responsiveImageProjection}
  }
}`)

function cardProjection(featured: boolean) {
  const image = featured ? "select(defined(featuredImage.asset._ref) => featuredImage, coverImage)" : "coverImage";
  return `{
  _id,
  title,
  featuredTitle,
  "slug": slug.current,
  "type": discipline,
  "category": ${featured ? "coalesce(featuredCategory, category)" : "category"},
  "mobileArchiveImageUrl": mobileArchiveImage.asset->url,
  location,
  "yearDisplay": coalesce(yearRange, string(year)),
  "imageUrl": ${image}.asset->url,
  "imageAlt": ${image}.alt,
  "image": ${image}${responsiveImageProjection}
}`;
}
const projectCardProjection = cardProjection(false);
const featuredCardProjection = cardProjection(true);

export const projectsPageQuery = defineQuery(`{
  "page": coalesce(
    *[_id == "projectsPage"][0],
    *[_type == "projectsPage"] | order(_updatedAt desc)[0]
  ){
    featuredHeading,
    featuredIntro,
    featuredYearRange,
    "featuredProjects": featuredProjects[]->${featuredCardProjection},
    archiveEyebrow,
    archiveHeading,
    archiveIntro,
    "archiveProjects": archiveProjects[]->${projectCardProjection},
    loadMoreLabel,
    seo
  },
  "featuredFlagged": *[_type == "project" && featured == true]
    | order(year desc, title asc)[0...10]${featuredCardProjection},
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
    storySections[]{title, body, layout, "imageUrl": image.asset->url, "imageAlt": image.alt, "imageData": image${responsiveImageProjection}, "mobileImageUrl": mobileImage.asset->url},
    "heroImageUrl": coalesce(detailHeroImage.asset->url, coverImage.asset->url),
    "heroImageAlt": coalesce(detailHeroImage.alt, coverImage.alt),
    "heroImageData": select(defined(detailHeroImage.asset._ref) => detailHeroImage, coverImage)${responsiveImageProjection},
    mobileHeroImage{asset,crop,hotspot},
    "gallery": gallery[]{
      "imageUrl": asset->url,
      "imageAlt": alt,
      "imageData": @${responsiveImageProjection}
    },
    "seo": seo{title, description, "imageUrl": image.asset->url},
    "relatedProjects": select($slug == "ge-digital" => *[_type == "project"] | order(year desc, title asc)${projectCardProjection}, relatedProjects[]->${projectCardProjection})
  }
`);

export const aboutPageQuery = defineQuery(`
  coalesce(*[_id == "aboutPage"][0], *[_type == "aboutPage"] | order(_updatedAt desc)[0]){
    heroTitle, heroEyebrow, "heroImageUrl": heroImage.asset->url, "heroImageAlt": heroImage.alt, "heroImageData": heroImage${responsiveImageProjection},
    introEyebrow, introHeading, introParagraphs,
    "introImages": introImages[]{"imageUrl": asset->url, "imageAlt": alt},
    stats[]{label, value}, philosophyEyebrow, philosophyHeading, philosophyIntro,
    principles[]{title, description}, clientsEyebrow, clientsHeading, clientsIntro,
    "clientLogos": clientLogos[]{"imageUrl": asset->url, "imageAlt": alt, website},
    peopleEyebrow, peopleHeading, "people": people[]{_key, name, role, "imageUrl": image.asset->url, "imageAlt": image.alt, "directoryPortraitUrl": directoryPortrait.asset->url, "directoryPortraitAlt": directoryPortrait.alt},
    awardsEyebrow, awardsHeading, awardsIntro, awards[]{project, award, year},
    careersEyebrow, valuesHeading, valuesIntro, values[]{icon, title, description}, seo
  }
`);

export const servicesPageQuery = defineQuery(`
  coalesce(*[_id == "servicesPage"][0], *[_type == "servicesPage"] | order(_updatedAt desc)[0]){
    heroTitle, "heroImageUrl": heroImage.asset->url, "heroImageAlt": heroImage.alt, "heroImageData": heroImage${responsiveImageProjection},
    "mobileHeroImageUrl": mobileHeroImage.asset->url, processEyebrow, processHeading, processSteps[]{number, title, subtitle, deliverables},
    servicesEyebrow, servicesHeading,
    "services": services[]{mark, title, description, "items": items[]{title, description, "imageUrl": image.asset->url, "imageAlt": image.alt}},
    "featuredProjects": featuredProjects[]->${projectCardProjection},
    "catalogue": select(count(featuredProjects) > 0 => [], *[_type == "project"] | order(title asc)${projectCardProjection}), seo
  }
`);

export const clientsPageQuery = defineQuery(`{
  "page": coalesce(*[_id == "clientsPage"][0], *[_type == "clientsPage"] | order(_updatedAt desc)[0]){
    countLabel, heroTitle, "heroImageUrl": heroImage.asset->url, "heroImageAlt": heroImage.alt, "heroImageData": heroImage${responsiveImageProjection},
    indexTitle, loadMoreLabel, seo
  },
  "clients": *[_type == "client"] | order(coalesce(order, 999999) asc, name asc){name, category, directoryCategory, year}
}`);

export const contactPageQuery = defineQuery(`
  coalesce(*[_id == "contactPage"][0], *[_type == "contactPage"] | order(_updatedAt desc)[0]){
    heroTitle, heroIntro, "heroImageUrl": heroImage.asset->url, "heroImageAlt": heroImage.alt, "heroImageData": heroImage${responsiveImageProjection},
    infoEyebrow, infoHeading, infoIntro, additionalPhones, phoneLabel, emailLabel, mainOfficeLabel,
    satelliteOfficesHeading, satelliteOfficeOrder, socialLabel, careersEyebrow, seo
  }
`);

const blogPostProjection = `{
  _id, title, "slug": slug.current, category, topics, "blogCategory": coalesce(blogCategory, "spaceLabs"), publishedAt, excerpt,
  "imageUrl": coverImage.asset->url, "imageAlt": coverImage.alt, "image": coverImage${responsiveImageProjection},
  "sections": sections[]{title, "body": paragraphs, bullets, "imageUrl": image.asset->url, "imageAlt": image.alt, "imageData": image${responsiveImageProjection}, quote},
  "seo": seo{title, description, "imageUrl": image.asset->url}
}`;

export const blogPageQuery = defineQuery(`{
  "page": coalesce(*[_id == "blogPage"][0], *[_type == "blogPage"] | order(_updatedAt desc)[0]){
    heroTitle, heroIntro, primaryTabLabel, secondaryTabLabel,
    "featuredPosts": featuredPosts[]->${blogPostProjection},
    "featuredProjects": featuredProjects[]->${projectCardProjection}, seo
  },
  "allPosts": *[_type == "blogPost"] | order(publishedAt desc)${blogPostProjection},
  "defaultFeaturedProjects": *[_type == "project" && slug.current in ["ge-digital", "wells-fargo", "unilever", "indigo"]]${projectCardProjection}
}`);

export const blogPostBySlugQuery = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0]{
    ${blogPostProjection.slice(1, -1)},
    "relatedPosts": relatedPosts[]->${blogPostProjection}
  }
`);
