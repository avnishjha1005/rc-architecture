import { defineQuery } from "next-sanity";

export const homePageQuery = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    title
  },
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
    navigation[]{label, href},
    cta{label, href},
    stats[]{value, label},
    about{eyebrow, title, description, cta{label, href}, ideologiesLabel, ideologies[]{title, description}},
    services{eyebrow, title, intro, cta{label, href}, items[]{number, title, description, features, "imageUrl": image.asset->url, "imageAlt": image.alt}},
    projects{eyebrow, title, intro, cta{label, href}, items[]{title, category, year, href, "imageUrl": image.asset->url, "imageAlt": image.alt}},
    labs{eyebrow, intro, cta{label, href}, articles[]{title, category, href, "imageUrl": image.asset->url, "imageAlt": image.alt}},
    contact{eyebrow, title, description, cta{label, href}, "imageUrl": image.asset->url, "imageAlt": image.alt},
    newsletter{eyebrow, title, description, placeholder, buttonLabel, "imageUrl": image.asset->url},
    footer{eyebrow, title, email, blurb, addressLabel, address, phone, hoursLabel, hours, legal, navigation[]{label, href}}
  }
}`)
