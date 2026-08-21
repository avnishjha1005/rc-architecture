export function SectionHeading({ eyebrow, title, intro, dark = false }: { eyebrow: string; title: string; intro?: string; dark?: boolean }) {
  return (
    <div className={`section-heading${dark ? " section-heading--dark" : ""}`}>
      <p className="eyebrow">({eyebrow})</p>
      <h2>{title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
      {intro && <p className="section-heading__intro">{intro}</p>}
    </div>
  );
}
