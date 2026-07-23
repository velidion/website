import type { CanvasEffect, CanvasEffectHost } from "./types";

/** Tiny deterministic PRNG (mulberry32) — just enough to give each blob
 *  varied-but-stable starting parameters without pulling in a dependency. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

interface Blob {
  baseX: number;
  baseY: number;
  ampX: number;
  ampY: number;
  freqX1: number;
  freqX2: number;
  freqY1: number;
  freqY2: number;
  phaseX1: number;
  phaseX2: number;
  phaseY1: number;
  phaseY2: number;
  radius: number;
  radiusAmp: number;
  radiusFreq: number;
  radiusPhase: number;
  alpha: number;
}

const BLOB_COUNT = 4;

// Tuning knobs — adjust these to taste.
const RADIUS_MIN = 0.22; // fraction of the shorter canvas dimension
const RADIUS_MAX = 0.34;
const ALPHA_MIN = 0.16; // per-blob peak opacity (blobs overlap additively)
const ALPHA_MAX = 0.26;

/** Soft drifting color blobs, aurora-borealis style. Each blob's position
 *  and radius are driven by two summed sine waves per axis at incommensurate
 *  frequencies — cheap "quasi-noise" that never repeats on a noticeable
 *  timescale, without needing a full Perlin/simplex implementation. */
export class AuroraEffect implements CanvasEffect {
  private readonly rgb: string;
  private blobs: Blob[] = [];

  constructor(color = "#E8F1F3") {
    this.rgb = hexToRgb(color);
  }

  init(): void {
    const rand = mulberry32(1337);
    this.blobs = Array.from({ length: BLOB_COUNT }, () => ({
      baseX: 0.15 + rand() * 0.7,
      baseY: 0.15 + rand() * 0.7,
      ampX: 0.12 + rand() * 0.1,
      ampY: 0.12 + rand() * 0.1,
      freqX1: 0.05 + rand() * 0.03,
      freqX2: 0.08 + rand() * 0.05,
      freqY1: 0.04 + rand() * 0.03,
      freqY2: 0.09 + rand() * 0.04,
      phaseX1: rand() * Math.PI * 2,
      phaseX2: rand() * Math.PI * 2,
      phaseY1: rand() * Math.PI * 2,
      phaseY2: rand() * Math.PI * 2,
      radius: RADIUS_MIN + rand() * (RADIUS_MAX - RADIUS_MIN),
      radiusAmp: 0.05 + rand() * 0.05,
      radiusFreq: 0.03 + rand() * 0.02,
      radiusPhase: rand() * Math.PI * 2,
      alpha: ALPHA_MIN + rand() * (ALPHA_MAX - ALPHA_MIN),
    }));
  }

  render(host: CanvasEffectHost, time: number): void {
    const { ctx, width, height } = host;
    const t = time / 1000;
    // Sized off the shorter dimension so blobs read as distinct drifting
    // patches instead of one flat wash on a wide-but-short section like hero.
    const extent = Math.min(width, height);

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    for (const b of this.blobs) {
      const x =
        (b.baseX +
          b.ampX * Math.sin(t * b.freqX1 + b.phaseX1) * 0.6 +
          b.ampX * Math.sin(t * b.freqX2 + b.phaseX2) * 0.4) *
        width;
      const y =
        (b.baseY +
          b.ampY * Math.sin(t * b.freqY1 + b.phaseY1) * 0.6 +
          b.ampY * Math.sin(t * b.freqY2 + b.phaseY2) * 0.4) *
        height;
      const r = (b.radius + b.radiusAmp * Math.sin(t * b.radiusFreq + b.radiusPhase)) * extent;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, `rgba(${this.rgb}, ${b.alpha})`);
      gradient.addColorStop(1, `rgba(${this.rgb}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.globalCompositeOperation = "source-over";
  }
}
