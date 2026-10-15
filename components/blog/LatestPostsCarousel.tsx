"use client";

import Image from "next/image";
import Link from "next/link";
import { A11y, FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { BlogPost } from "@/content/blog";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillAction } from "@/components/ui/PillAction";
import styles from "@/app/blog/[slug]/blog-detail.module.css";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import "swiper/css/scrollbar";

type LatestPost = Pick<BlogPost, "slug" | "title" | "category" | "date" | "imageUrl" | "imageAlt">;

export function LatestPostsCarousel({ posts }: { posts: LatestPost[] }) {
  return (
    <section className={styles.latest} aria-labelledby="latest-posts-title" data-motion-group="section">
      <div className={styles.latestHead}>
        <Eyebrow className={styles.latestLabel} data-motion-item>Featured posts</Eyebrow>
        <div className={styles.latestTitle} data-motion-item>
          <h2 id="latest-posts-title">Latest Posts</h2>
          <PillAction className={styles.latestBack} href="/blog">Back to all posts</PillAction>
        </div>
      </div>
      <div className={styles.latestRail} data-motion-item>
        <Swiper
          className={styles.latestGrid}
          modules={[A11y, FreeMode, Mousewheel, Scrollbar]}
          slidesPerView={1.12}
          spaceBetween={16}
          grabCursor
          watchOverflow
          freeMode={{ enabled: true, momentum: true, sticky: false }}
          mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
          scrollbar={{ draggable: true, hide: false }}
          breakpoints={{ 761: { slidesPerView: 2.55, spaceBetween: 20 } }}
          a11y={{ containerMessage: "Latest posts carousel" }}
        >
          {posts.map((item) => (
            <SwiperSlide className={styles.latestSlide} key={item.slug}>
              <article>
                <Link className={styles.latestImage} href={`/blogs/${item.slug}`}><Image src={item.imageUrl} alt={item.imageAlt} fill sizes="(max-width: 760px) 84vw, 34vw" /></Link>
                <p className={styles.latestEyebrow}>{item.category}</p>
                <h3><Link href={`/blogs/${item.slug}`}>{item.title}</Link></h3>
                <time>{item.date}</time>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
