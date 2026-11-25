import type { Stat } from "@/content/home";
import { CountUp } from "@/components/ui/CountUp";

function StatItems({ stats, duplicate = false }: { stats: Stat[]; duplicate?: boolean }) {
  return (
    <div className={`stats__group${duplicate ? " stats__group--duplicate" : ""}`} aria-hidden={duplicate || undefined}>
      {stats.map((stat) => (
        <dl className="stat" key={`${duplicate ? "copy-" : ""}${stat.value}-${stat.label}`}>
          <dt><CountUp value={stat.value || "—"} /></dt>
          <dd>{(stat.label || "Studio highlight").split("\n").map((line) => <span key={line}>{line}</span>)}</dd>
        </dl>
      ))}
    </div>
  );
}

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="stats" aria-label="Practice highlights" data-motion-item data-count-group>
      <div className="stats__rail">
        <StatItems stats={stats} />
        <StatItems stats={stats} duplicate />
      </div>
    </section>
  );
}
