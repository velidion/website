import type { CanvasEffect } from "./types";
import { AuroraEffect } from "./AuroraEffect";
import { GentleWavesEffect } from "./GentleWavesEffect";

/** name -> factory, looked up by a canvas' data-canvas-effect attribute.
 *  Adding a new pattern later is just one more entry here plus the class
 *  that implements CanvasEffect — nothing in mount.ts or the markup that
 *  uses it needs to change. */
export const canvasEffects: Record<string, () => CanvasEffect> = {
  aurora: () => new AuroraEffect(),
  "gentle-waves": () => new GentleWavesEffect(),
};
