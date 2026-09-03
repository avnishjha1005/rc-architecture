"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type SwiperCore from "swiper";
import { A11y, FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { BlogPost } from "@/content/blog";
import styles from "@/app/blog/[slug]/blog-detail.module.css";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import "swiper/css/scrollbar";

type LatestPost = Pick<BlogPost, "slug" | "title" | "category" | "date" | "imageUrl" | "imageAlt">;

export function LatestPostsCarousel({ posts }: { posts: LatestPost[] }) {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(posts.length > 3);

  function updateControls(instance: SwiperCore) {
    setCanPrevious(!instance.isBeginning);
    setCanNext(!instance.isEnd);
  }

  return (
    <section className={styles.latest} aria-labelledby="latest-posts-title">
      <div className={styles.latestHead}>
        <h2 id="latest-posts-title">Latest Posts</h2>
        <div className={styles.latestControls}>
          <button type="button" disabled={!canPrevious} onClick={() => swiper?.slidePrev()} aria-label="Previous latest posts">←</button>
          <button type="button" disabled={!canNext} onClick={() => swiper?.slideNext()} aria-label="Next latest posts">→</button>
        </div>
      </div>
      <Swiper
        className={styles.latestGrid}
        modules={[A11y, FreeMode, Mousewheel, Scrollbar]}
        slidesPerView={1.15}
        spaceBetween={16}
        grabCursor
        watchOverflow
        freeMode={{ enabled: true, momentum: true, sticky: false }}
        mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
        scrollbar={{ draggable: true, hide: false }}
        breakpoints={{ 761: { slidesPerView: 3, spaceBetween: 20 } }}
        a11y={{ containerMessage: "Latest posts carousel" }}
        onSwiper={(instance) => { setSwiper(instance); updateControls(instance); }}
        onSlideChange={updateControls}
        onFromEdge={updateControls}
        onReachBeginning={updateControls}
        onReachEnd={updateControls}
      >
        {posts.map((item) => (
          <SwiperSlide className={styles.latestSlide} key={item.slug}>
            <article>
              <Link className={styles.latestImage} href={`/blogs/${item.slug}`}><Image src={item.imageUrl} alt={item.imageAlt} fill sizes="(max-width: 760px) 80vw, 30vw" /></Link>
              <p className={styles.latestEyebrow}>{item.category}</p>
              <h3><Link href={`/blogs/${item.slug}`}>{item.title}</Link></h3>
              <time>{item.date}</time>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
