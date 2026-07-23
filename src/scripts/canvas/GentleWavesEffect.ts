import type { CanvasEffect, CanvasEffectHost } from "./types";
import { resolveCssVarRgb } from "./color";

/** A grid of straight guide-lines plus three families of long flowing lines
 *  (horizontal, diagonal, vertical), all driven by sine motion — ported from
 *  a standalone full-viewport React/canvas piece into this site's
 *  CanvasEffect contract. Two changes from the source: it clears with
 *  clearRect instead of filling an opaque background, so it composites over
 *  whatever the host section already has (here, the .noise-bg grain) rather
 *  than covering it; and its stroke color comes from --line at runtime
 *  instead of a fixed gray, so it always matches the page's own guide lines.
 *  The specific magic numbers below (line counts, opacity/amplitude curves)
 *  are kept as in the source — they're what produces its particular look,
 *  not arbitrary placeholders. */
export class GentleWavesEffect implements CanvasEffect {
  private rgb = "80, 80, 80";

  init(): void {
    this.rgb = resolveCssVarRgb("var(--line)");
  }

  render(host: CanvasEffectHost, time: number): void {
    const { ctx, width, height } = host;
    const rgb = this.rgb;
    // Source incremented time by 0.005 per rendered frame; at a 60fps
    // baseline that's 0.3/sec — reproduced here from the rAF timestamp so
    // speed stays correct regardless of actual frame rate.
    const t = (time / 1000) * 0.3;

    ctx.clearRect(0, 0, width, height);

    // Straight grid — the underlying structure.
    ctx.strokeStyle = `rgba(${rgb}, 0.033)`;
    ctx.lineWidth = 0.3;
    for (let y = 0; y < height; y += 40) {
      const offsetY = 5 * Math.sin(t + y * 0.01);
      ctx.beginPath();
      ctx.moveTo(0, y + offsetY);
      ctx.lineTo(width, y + offsetY);
      ctx.stroke();
    }
    for (let x = 0; x < width; x += 40) {
      const offsetX = 5 * Math.sin(t + x * 0.01);
      ctx.beginPath();
      ctx.moveTo(x + offsetX, 0);
      ctx.lineTo(x + offsetX, height);
      ctx.stroke();
    }

    // Long horizontal flowing lines.
    const numHorizontal = 30;
    for (let i = 0; i < numHorizontal; i++) {
      const yPos = (i / numHorizontal) * height;
      const amplitude = 40 + 20 * Math.sin(t * 0.2 + i * 0.1);
      const frequency = 0.008 + 0.004 * Math.sin(t * 0.1 + i * 0.05);
      const speed = t * (0.5 + 0.3 * Math.sin(i * 0.1));
      const thickness = 0.8 + 0.6 * Math.sin(t + i * 0.2);
      const opacity = 0.132 + 0.088 * Math.abs(Math.sin(t * 0.3 + i * 0.15));

      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.strokeStyle = `rgba(${rgb}, ${opacity})`;
      for (let x = 0; x < width; x += 2) {
        const y = yPos + amplitude * Math.sin(x * frequency + speed);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Long diagonal flowing lines.
    const numDiagonal = 35;
    for (let i = 0; i < numDiagonal; i++) {
      const offset = (i / numDiagonal) * width * 2 - width * 0.5;
      const amplitude = 30 + 20 * Math.cos(t * 0.25 + i * 0.1);
      const phase = t * (0.3 + 0.2 * Math.sin(i * 0.1));
      const thickness = 0.7 + 0.5 * Math.sin(t + i * 0.25);
      const opacity = 0.11 + 0.077 * Math.abs(Math.sin(t * 0.2 + i * 0.1));

      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.strokeStyle = `rgba(${rgb}, ${opacity})`;
      const steps = 100;
      for (let j = 0; j <= steps; j++) {
        const progress = j / steps;
        const x = offset + progress * width;
        const y = progress * height + amplitude * Math.sin(progress * 8 + phase);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Long vertical flowing lines.
    const numVertical = 25;
    for (let i = 0; i < numVertical; i++) {
      const xPos = (i / numVertical) * width;
      const amplitude = 35 + 15 * Math.sin(t * 0.15 + i * 0.12);
      const frequency = 0.009 + 0.004 * Math.cos(t * 0.12 + i * 0.07);
      const speed = t * (0.4 + 0.25 * Math.cos(i * 0.15));
      const thickness = 0.6 + 0.4 * Math.sin(t + i * 0.3);
      const opacity = 0.099 + 0.066 * Math.abs(Math.sin(t * 0.25 + i * 0.18));

      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.strokeStyle = `rgba(${rgb}, ${opacity})`;
      for (let y = 0; y < height; y += 2) {
        const x = xPos + amplitude * Math.sin(y * frequency + speed);
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
}
