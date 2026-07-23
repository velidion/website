/** Shared context handed to a CanvasEffect on every lifecycle call.
 *  width/height are CSS pixels (the canvas' on-screen size) — effects should
 *  never need to touch canvas.width/height or devicePixelRatio directly;
 *  the mount engine owns backing-store sizing and keeps ctx pre-scaled to
 *  the device pixel ratio so effects can draw in plain CSS-pixel units. */
export interface CanvasEffectHost {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

/** Contract every canvas background pattern implements. Register a new
 *  effect in ./registry.ts and it becomes available anywhere via
 *  data-canvas-effect="<name>" — the mount engine, sizing, visibility
 *  pausing, and reduced-motion handling are all shared and effect-agnostic. */
export interface CanvasEffect {
  /** Called once, after the host has its initial size. Set up any
   *  randomized/derived state here. */
  init(host: CanvasEffectHost): void;
  /** Called every animation frame (or once, with time=0, under
   *  prefers-reduced-motion). time is a DOMHighResTimeStamp in ms. */
  render(host: CanvasEffectHost, time: number): void;
  /** Called after the host is resized, before the next render. Optional —
   *  effects whose state is already resolution-independent can skip it. */
  resize?(host: CanvasEffectHost): void;
}
