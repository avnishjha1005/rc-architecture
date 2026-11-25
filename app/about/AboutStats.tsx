import { CountUp } from "@/components/ui/CountUp";

type StatItem = readonly [label: string, value: string];

function displayValue(value: string) {
  return value.replace(/(-?\d[\d,]*(?:\.\d+)?)([^\d,].*)$/, "$1\u2009$2");
}

export function AboutStats({ className, items }: { className: string; items: readonly StatItem[] }) {
  return (
    <section className={className} aria-label="Studio statistics">
      {items.map(([label, value]) => <div key={label}><p>{label}</p><strong><CountUp value={displayValue(value)} /></strong></div>)}
    </section>
  );
}
