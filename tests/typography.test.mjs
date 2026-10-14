import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import test from "node:test";

const roots = ["app", "components"];

function cssFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? cssFiles(path) : extname(path) === ".css" ? [path] : [];
  });
}

function pixels(token) {
  const match = token.match(/(-?\d*\.?\d+)\s*(px|rem|em)/i);
  if (!match) return null;
  return Number(match[1]) * (match[2].toLowerCase() === "px" ? 1 : 16);
}

test("CSS text never renders below the 12px accessibility floor", () => {
  for (const file of roots.flatMap(cssFiles)) {
    const css = readFileSync(file, "utf8");
    const declarations = css.matchAll(/\b(font-size|font)\s*:\s*([^;}]+)/gi);

    for (const [, property, rawValue] of declarations) {
      const value = rawValue.trim();
      let size;

      const clamp = value.match(/clamp\(([^,]+)/i);
      if (clamp) {
        size = pixels(clamp[1]);
      } else if (/max\(/i.test(value)) {
        const candidates = [...value.matchAll(/-?\d*\.?\d+\s*(?:px|rem|em)/gi)]
          .map(([token]) => pixels(token))
          .filter((candidate) => candidate !== null);
        size = candidates.length ? Math.max(...candidates) : null;
      } else {
        size = pixels(value);
      }

      assert.ok(
        size === null || size >= 12,
        `${file} has an undersized ${property} declaration: ${value}`,
      );
    }
  }
});

test("semantic small text does not apply the browser shrink factor", () => {
  const globals = readFileSync("app/globals.css", "utf8");
  assert.match(globals, /small\s*\{\s*font-size\s*:\s*inherit\s*}/);
});
