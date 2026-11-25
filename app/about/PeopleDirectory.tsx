"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "@/components/ui/SiteImage";
import layout from "./about-layout.module.css";
import styles from "./PeopleDirectory.module.css";

export type DirectoryPerson = {
  _key?: string;
  name?: string;
  role?: string;
  directoryPortraitUrl?: string;
  directoryPortraitAlt?: string;
};

export function PeopleDirectory({ people }: { people: DirectoryPerson[] }) {
  const id = useId();
  const [active, setActive] = useState<number | null>(null);
  const pendingClose = useRef<number | undefined>(undefined);
  const person = active === null ? undefined : people[active];

  function showPerson(index: number) {
    window.clearTimeout(pendingClose.current);
    setActive(index);
  }

  useEffect(() => () => window.clearTimeout(pendingClose.current), []);

  useEffect(() => {
    if (active === null) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [active]);

  return (
    <div className={`${layout.directory} ${styles.directory}`}>
      <ul className={styles.names} aria-label="Team directory">
        {people.map((entry, index) => (
          <li key={entry._key || `${entry.name}-${index}`}>
            <button
              type="button"
              className={styles.trigger}
              aria-controls={id}
              aria-expanded={active === index}
              aria-describedby={entry.role ? `${id}-role-${index}` : undefined}
              onPointerEnter={(event) => { if (event.pointerType !== "touch") showPerson(index); }}
              onPointerLeave={(event) => {
                if (event.pointerType === "touch") return;
                window.clearTimeout(pendingClose.current);
                pendingClose.current = window.setTimeout(() => setActive(current => current === index ? null : current), 120);
              }}
              onFocus={() => showPerson(index)}
              onBlur={() => setActive((current) => current === index ? null : current)}
              onClick={() => showPerson(index)}
            >{entry.name}</button>
            <span className={styles.staticName}>{entry.name}</span>
            {entry.role && <span id={`${id}-role-${index}`} className={styles.staticRole}>{entry.role}</span>}
          </li>
        ))}
      </ul>
      <figure className={styles.preview} id={id} hidden={!person}>
        {person && <>
          <span aria-hidden="true" className={styles.centerName}>{person.name}</span>
          {person.directoryPortraitUrl
            ? <Image src={person.directoryPortraitUrl} alt={person.directoryPortraitAlt || ""} width={456} height={478} sizes="(max-width: 1800px) 16vw, 288px" className={styles.portrait} />
            : <svg className={styles.portrait} viewBox="0 0 228 239" role="img" aria-label="No portrait available">
                <rect width="228" height="239" fill="#efefed" />
                <circle cx="114" cy="88" r="35" fill="#c5c5c1" />
                <path d="M37 219v-16a77 77 0 0 1 154 0v16z" fill="#c5c5c1" />
              </svg>}
          {person.role && <figcaption>{person.role}</figcaption>}
        </>}
      </figure>
    </div>
  );
}
