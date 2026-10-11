import type { Stat } from "@/content/home";

function StatItems({ stats, duplicate = false }: { stats: Stat[]; duplicate?: boolean }) {
  return (
    <div className={`stats__group${duplicate ? " stats__group--duplicate" : ""}`} aria-hidden={duplicate || undefined}>
      {stats.map((stat) => (
        <dl className="stat" key={`${duplicate ? "copy-" : ""}${stat.value}-${stat.label}`}>
          <dt>{stat.value}</dt>
          <dd>{stat.label.split("\n").map((line) => <span key={line}>{line}</span>)}</dd>
        </dl>
      ))}
    </div>
  );
}

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="stats" aria-label="Practice highlights">
      <div className="stats__rail">
        <StatItems stats={stats} />
        <StatItems stats={stats} duplicate />
      </div>
    </section>
  );
}
