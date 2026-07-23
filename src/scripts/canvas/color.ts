/** Converts a hex color like "#E8F1F3" to an "r, g, b" triplet, ready to
 *  interpolate into an rgba(...) template. */
export function hexToRgb(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/** Resolves a CSS color expression (e.g. "var(--line)") to its computed
 *  "r, g, b" triplet, discarding whatever alpha is baked into the token —
 *  callers apply their own alpha on top. This keeps a canvas effect's stroke
 *  color tied to the design system's actual custom property instead of a
 *  hardcoded literal that can silently drift out of sync with it. Custom
 *  properties can't be read directly via getComputedStyle (it returns the
 *  raw unresolved token string), so this applies the expression to a real
 *  color property on a throwaway element, whose *computed* value the
 *  browser does fully resolve (including color-mix()) — though as one of
 *  several possible serializations (e.g. modern Chrome returns this site's
 *  color-mix() tokens as "color(srgb 0.04 0.07 0.16 / 0.12)", 0-1 floats,
 *  not legacy "rgba(10, 17, 40, 0.12)" 0-255 ints). Rather than parsing that
 *  string ourselves — the format varies by browser/version and includes
 *  wide-gamut color(), oklch(), etc. — it's handed to canvas fillStyle,
 *  whose parser normalizes any valid CSS color, then read back with
 *  getImageData, which always returns plain 0-255 integer channels. */
export function resolveCssVarRgb(cssColor: string, fallback = "80, 80, 80"): string {
  if (typeof document === "undefined") return fallback;
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:${cssColor};`;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return fallback;
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `${r}, ${g}, ${b}`;
}
