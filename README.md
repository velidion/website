# Velidion — website

Marketing site for [velidion.com](https://velidion.com). Static [Astro](https://astro.build) site — fast, SEO-friendly, deploys anywhere for free.

Current state: a single company landing page (pre-product) that introduces the company and gives visitors a way to get in touch by email. Matches the 90-day roadmap in `company-hq` (`strategy/working-assumptions.md`).

## Quick start

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # static output to ./dist
npm run preview  # preview the production build locally
```

Requires Node 18+ (built and tested on Node 22).

The brand name and contact email (`hello@velidion.com`, forwards to a personal inbox) live in one place, `src/site.config.ts`, imported directly wherever they're needed (`Nav`, `Footer`, `Layout`, `Logo`) — update that file, not the individual components.

TypeScript path alias `@/*` → `src/*` is available (see `tsconfig.json`) for any new code that ends up nested deep enough that relative imports get unwieldy; existing imports haven't been migrated to it.

## Structure

```
website/
├─ src/
│  ├─ site.config.ts          ← brand name + contact email, single source of truth
│  ├─ pages/index.astro       ← the landing page (composes the sections below)
│  ├─ components/
│  │  ├─ Nav.astro, Footer.astro, Logo.astro
│  │  ├─ Section.astro                    ← wrapper for a noise-bg/tint section + its boundary marks
│  │  ├─ SectionBoundaryMarks.astro       ← per-section guide-line diamond markup (used by Section)
│  │  ├─ SectionBoundaryMarksVisibility.astro  ← global scroll listener that hides those marks near the nav
│  │  └─ CanvasBackground.astro           ← mounts a canvas background effect (see scripts/canvas/ below)
│  ├─ scripts/canvas/          ← the canvas background-effect engine backing CanvasBackground.astro:
│  │  │                          types.ts (CanvasEffect contract), registry.ts (name → effect
│  │  │                          lookup), mount.ts (sizing/visibility/rAF), color.ts (design-token
│  │  │                          color resolution), GentleWavesEffect.ts (the current effect)
│  ├─ layouts/Layout.astro    ← <head>, meta/SEO/OpenGraph, fonts
│  └─ styles/
│     ├─ tokens.css           ← brand colors/type, vendored from design-system/tokens/
│     └─ global.css           ← components built on those tokens
├─ public/
│  ├─ logo-mark.png, logo-mark-gradient.svg  ← brand mark (v0.1.2)
│  └─ favicon.png, apple-touch-icon.png
├─ astro.config.mjs           ← site URL
└─ package.json
```

Colors, type, and the logo come from the `design-system` repo — the source of truth for the brand lives there, not here. `src/styles/tokens.css` is a verbatim copy of `design-system/tokens/colors.css` and `tokens/typography.css`; if the brand system changes, update it there first, then copy the values over.

## Notes

- The Audience, Belief, Solution, Credibility, and CTA sections on the page currently render with no content — the Hero and Problem section render with fake content.
