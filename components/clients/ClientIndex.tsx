"use client";

import { useMemo, useState } from "react";
import type { Client } from "@/content/clients";
import styles from "@/app/clients/clients.module.css";

const MOBILE_BATCH = 48;

export function ClientIndex({ clients, title = "Index", searchPlaceholder = "Search clients", loadMoreLabel = "Load more" }: { clients: Client[]; title?: string; searchPlaceholder?: string; loadMoreLabel?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState(MOBILE_BATCH);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return clients.filter((client) =>
      (category === "All" || client.category === category) &&
      (!needle || client.name.toLocaleLowerCase().includes(needle)),
    );
  }, [category, clients, query]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(clients.map((client) => client.category)))],
    [clients],
  );
  const chunkSize = Math.ceil(filtered.length / 3);
  const columns = [0, 1, 2].map((column) => filtered.slice(column * chunkSize, (column + 1) * chunkSize));

  function row(client: Client, index: number) {
    const hiddenOnMobile = index >= visible;
    return (
      <li className={hiddenOnMobile ? styles.mobileHidden : undefined} key={client.name}>
        <span className={styles.category}>{client.category}</span>
        <button className={styles.clientName} type="button">{client.name}</button>
        <span className={styles.year}>{client.year}</span>
      </li>
    );
  }

  return (
    <div className={styles.indexInner}>
      <div className={styles.indexTopline}>
        <h2>{title}</h2>
        <div className={styles.controls}>
          <label>
            <span className="sr-only">Search clients</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(MOBILE_BATCH); }} placeholder={searchPlaceholder} type="search" />
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <select value={category} onChange={(event) => { setCategory(event.target.value); setVisible(MOBILE_BATCH); }}>
              {categories.map((option) => <option value={option} key={option}>{option === "All" ? "Categories" : option}</option>)}
            </select>
          </label>
        </div>
      </div>

      <p className={styles.resultCount} aria-live="polite">{filtered.length} {filtered.length === 1 ? "client" : "clients"}</p>
      {filtered.length ? (
        <div className={styles.clientColumns}>
          {columns.map((column, columnIndex) => (
            <div className={styles.clientColumn} key={columnIndex}>
              <div className={styles.columnHead}><span>Category</span><span>Client Name</span><span>Year</span></div>
              <ul>{column.map((client, rowIndex) => row(client, columnIndex * chunkSize + rowIndex))}</ul>
            </div>
          ))}
        </div>
      ) : <p className={styles.empty}>No clients match “{query}”.</p>}
      {visible < filtered.length && <button className={styles.loadMore} type="button" onClick={() => setVisible((count) => count + MOBILE_BATCH)}>{loadMoreLabel} <span aria-hidden="true">↑</span></button>}
    </div>
  );
}
