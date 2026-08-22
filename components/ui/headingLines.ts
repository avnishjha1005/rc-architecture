type HeadingBreak = number | "before-last";

export function headingLines(value: string | null | undefined, fallbackBreak: HeadingBreak) {
  const text = value?.trim();
  if (!text) return [];

  const explicitLines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (explicitLines.length > 1) return explicitLines;

  const words = text.split(/\s+/);
  if (words.length < 2) return [text];

  const breakAfter = fallbackBreak === "before-last"
    ? words.length - 1
    : Math.min(Math.max(fallbackBreak, 1), words.length - 1);

  return [words.slice(0, breakAfter).join(" "), words.slice(breakAfter).join(" ")];
}
