import Link from "next/link";
import { useState } from "react";
import type { PortfolioProject } from "@/content/projects";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { legacyImage } from "@/lib/responsive-image";
import { ProjectCategory, visibleProjectTags } from "./ProjectMeta";
import styles from "@/app/projects/projects.module.css";

function ProjectPreview({ project }: { project: PortfolioProject | null }) {
  const [shown, setShown] = useState<PortfolioProject | null>(null);
  const pending = project !== shown ? project : null;
  return (
    <div className={`${styles.hoverReveal} ${project && shown ? styles.hoverRevealVisible : ""}`} aria-hidden="true" data-no-image-wipe>
      {[shown, pending].map(item => item && (
        <ResponsiveImage
          key={item.id}
          className={item === shown ? styles.previewFront : undefined}
          image={{ ...(item.image || legacyImage(item.imageUrl, "")), alt: "" }}
          fill
          sizes="(max-width: 600px) 90vw, 540px"
          loading="eager"
          onLoad={() => {
            if (item === pending) setShown(item);
          }}
        />
      ))}
    </div>
  );
}

export function ProjectList({ projects }: { projects: PortfolioProject[] }) {
  const [hovered, setHovered] = useState<PortfolioProject | null>(null);
  const [focused, setFocused] = useState<PortfolioProject | null>(null);
  return (
    <div className={styles.listWrap}>
      <ProjectPreview project={hovered ?? focused} />
      <div className={styles.projectList} onPointerLeave={() => setHovered(null)}>
        {projects.map(project => (
          <Link
            className={styles.listRow}
            data-project-item={project.slug}
            href={project.href}
            key={project.id}
            onPointerEnter={event => {
              if (event.pointerType !== "touch" && window.matchMedia("(any-hover: hover)").matches) setHovered(project);
            }}
            onFocus={event => {
              if (event.currentTarget.matches(":focus-visible")) {
                setHovered(null);
                setFocused(project);
              }
            }}
            onBlur={() => setFocused(null)}
          >
            <span><span>{project.title}</span></span>
            <span><ProjectCategory category={visibleProjectTags(project.category)} /></span>
            <span><span>{project.location}</span></span>
            <span><span>{project.year}</span></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
