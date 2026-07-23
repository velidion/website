import { canvasEffects } from "./registry";
import type { CanvasEffect, CanvasEffectHost } from "./types";

const MOUNTED_ATTR = "data-canvas-mounted";
const MAX_DPR = 3;

function resizeHost(host: CanvasEffectHost): void {
  const rect = host.canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  host.width = rect.width;
  host.height = rect.height;
  host.canvas.width = Math.round(rect.width * dpr);
  host.canvas.height = Math.round(rect.height * dpr);
  host.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function mountOne(canvas: HTMLCanvasElement): void {
  if (canvas.hasAttribute(MOUNTED_ATTR)) return;
  canvas.setAttribute(MOUNTED_ATTR, "");

  const createEffect = canvasEffects[canvas.dataset.canvasEffect ?? ""];
  const ctx = canvas.getContext("2d");
  if (!createEffect || !ctx) return;

  const effect: CanvasEffect = createEffect();
  const host: CanvasEffectHost = { canvas, ctx, width: 0, height: 0 };

  // A single canvas' init/render can hit environment quirks entirely outside
  // our control (e.g. a mobile browser's anti-fingerprinting protections
  // restricting a canvas API). Isolating each canvas here means one bad
  // canvas fails silently instead of throwing out of the forEach in
  // mountCanvasBackgrounds and leaving every *other* canvas on the page
  // unmounted too.
  try {
    resizeHost(host);
    effect.init(host);
  } catch (err) {
    console.error("canvas effect failed to init:", err);
    return;
  }

  // Deliberately animates regardless of prefers-reduced-motion: this is a
  // decorative, low-contrast ambient background (no flashing/strobing), and
  // the one-frame-then-stop path this used to take here was the mobile bug
  // — it returned before the ResizeObserver below was ever attached, so if
  // the very first layout size (taken before mobile web fonts/viewport
  // chrome settle) was even slightly off, that single frame stayed locked
  // to a stale backing-store size forever, which the browser then visibly
  // stretched to fit the box.
  let frameId = 0;
  let running = false;
  const tick = (time: number) => {
    if (!running) return;
    effect.render(host, time);
    frameId = requestAnimationFrame(tick);
  };
  const start = () => {
    if (running) return;
    running = true;
    frameId = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(frameId);
  };

  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
    threshold: 0,
  }).observe(canvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (canvas.getBoundingClientRect().top < window.innerHeight) start();
  });

  new ResizeObserver(() => {
    resizeHost(host);
    effect.resize?.(host);
    // Changing a canvas' width/height attributes (inside resizeHost) wipes
    // its bitmap immediately, and the redraw would otherwise wait for the
    // next scheduled rAF tick. A live window-drag can fire resizes faster
    // than that tick arrives — e.g. once a CSS breakpoint makes this
    // canvas's width track 100vw directly instead of a fixed value, nearly
    // every pixel of drag is a resize — so the gap between "cleared" and
    // "redrawn" becomes visible flicker. Repainting synchronously here
    // closes that gap.
    effect.render(host, performance.now());
  }).observe(canvas);
}

/** Finds every not-yet-mounted `canvas[data-canvas-effect]` under `root` and
 *  starts it. Astro dedupes identical inline <script>s across component
 *  instances, so this typically runs once per page regardless of how many
 *  <CanvasBackground> components are used — but it's idempotent either way. */
export function mountCanvasBackgrounds(root: ParentNode = document): void {
  root.querySelectorAll<HTMLCanvasElement>("canvas[data-canvas-effect]").forEach(mountOne);
}
