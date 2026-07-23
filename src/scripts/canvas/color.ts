/** Converts a hex color like "#E8F1F3" to an "r, g, b" triplet, ready to
 *  interpolate into an rgba(...) template. */
export function hexToRgb(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/** Resolves a root-level CSS custom property (e.g. "--velidion-color-text")
 *  to an "r, g, b" triplet, so a canvas effect's stroke/fill color can stay
 *  tied to a design-system token instead of a hardcoded literal that can
 *  drift out of sync. Deliberately reads the plain color token itself
 *  rather than a derived token like --line (color-mix(... 12%, transparent))
 *  — color-mix against transparent only scales alpha, never hue, and
 *  callers apply their own alpha anyway, so reading the plain token gives
 *  the same hue. This also sidesteps two real problems with resolving a
 *  color-mix() result: its computed serialization varies by browser (e.g.
 *  Chrome returns "color(srgb 0.04 0.07 0.16 / 0.12)", 0-1 floats, not
 *  "rgba(10, 17, 40, 0.12)"), and the previous approach normalized that via
 *  a throwaway canvas + getImageData — a canvas-fingerprinting-sensitive
 *  API that some mobile/privacy-hardened browsers throttle or perturb. A
 *  plain custom property is just text substitution, so getPropertyValue
 *  returns the literal authored string identically everywhere. */
export function resolveCssVarRgb(varName: string, fallback = "80, 80, 80"): string {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!raw) return fallback;
  if (raw.startsWith("#")) return hexToRgb(raw);
  const channels = raw.match(/[\d.]+/g);
  return channels && channels.length >= 3
    ? channels
        .slice(0, 3)
        .map((n) => Math.round(Number(n)))
        .join(", ")
    : fallback;
}
