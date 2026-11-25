"use client";

import { useMemo, useState } from "react";
import styles from "@/app/clients/clients.module.css";
import { LoadMoreArrow } from "@/components/ui/LoadMoreArrow";

const MOBILE_BATCH = 35;

export type DirectoryClient = { name: string; category?: string; directoryCategory?: string; year?: number };

function categoryLabel(client: DirectoryClient) {
  return client.directoryCategory?.trim() || client.category?.split("·")[0].trim() || "";
}

export function ClientIndex({ clients, title = "Index", loadMoreLabel = "Load more" }: { clients: DirectoryClient[]; title?: string; loadMoreLabel?: string }) {
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState(MOBILE_BATCH);

  const filtered = useMemo(
    () => clients.filter((client) => category === "All" || categoryLabel(client) === category),
    [category, clients],
  );

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(clients.map(categoryLabel).filter(Boolean))).sort((a, b) => a.localeCompare(b, "en"))],
    [clients],
  );
  const chunkSize = Math.max(MOBILE_BATCH, Math.ceil(filtered.length / 3));
  const columns = [0, 1, 2].map((column) => filtered.slice(column * chunkSize, (column + 1) * chunkSize)).filter(column => column.length);

  function row(client: DirectoryClient, index: number) {
    const hiddenOnMobile = index >= visible;
    return (
      <li className={hiddenOnMobile ? styles.mobileHidden : undefined} key={client.name} tabIndex={0}>
        <span className={styles.category}>{categoryLabel(client)}</span>
        <span className={styles.clientName}>{client.name}</span>
        <span className={styles.year}>{client.year ?? <><span aria-hidden="true">—</span><span className="sr-only">Year not available</span></>}</span>
      </li>
    );
  }

  return (
    <div className={styles.indexInner}>
      <div className={styles.indexTopline}>
        <h2>{title}</h2>
        <div className={styles.controls}>
          <label>
            <span className="sr-only">Filter by category</span>
            <select data-lenis-prevent value={category} onChange={(event) => { setCategory(event.target.value); setVisible(MOBILE_BATCH); }}>
              {categories.map((option) => <option value={option} key={option}>{option === "All" ? "Categories" : option}</option>)}
            </select>
          </label>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{filtered.length} {filtered.length === 1 ? "client" : "clients"}</p>
      {filtered.length ? (
        <div className={styles.clientColumns}>
          {columns.map((column, columnIndex) => (
            <div className={styles.clientColumn} key={columnIndex} role="group" aria-label={`Client index column ${columnIndex + 1}`}>
              <div className={styles.columnHead}><span>Category</span><span>Client Name</span><span>Year</span></div>
              <ul>{column.map((client, rowIndex) => row(client, columnIndex * chunkSize + rowIndex))}</ul>
            </div>
          ))}
        </div>
      ) : <p className={styles.empty}>No clients have been added to this category.</p>}
      {visible < filtered.length && <button className={styles.loadMore} type="button" onClick={() => setVisible((count) => count + MOBILE_BATCH)}>{loadMoreLabel} <LoadMoreArrow /></button>}
    </div>
  );
}
