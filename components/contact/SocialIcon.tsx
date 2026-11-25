export function SocialIcon({ label, fallback }: { label: string; fallback: string }) {
  const name = label.toLowerCase();
  const glyph = name.includes("linkedin") ? <><rect x="3" y="9" width="3" height="11" /><circle cx="4.5" cy="4.7" r="1.6" /><path d="M10 20V9h3v2c1-3 7-3 7 2v7h-3v-6c0-3-4-3-4 0v6Z" /></>
    : name.includes("instagram") ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.5" cy="6.5" r=".7" /></>
    : name.includes("facebook") ? <path d="M14 21v-8h3l.5-3H14V8c0-2 1-2.8 3.3-2.5V2.8C13 2 10.5 4 10.5 8v2H8v3h2.5v8Z" />
    : name === "x" || name.includes("twitter") ? <><path d="m3 3 13 18h5L8 3Z" /><path d="M20.5 3 14 10.5M10 14l-6.5 7" /></> : null;
  return glyph ? <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">{glyph}</svg> : <span aria-hidden="true">{fallback}</span>;
}
