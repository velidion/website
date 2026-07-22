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

The contact email (`hello@velidion.com`, forwards to a personal inbox) is set once, at the top of `src/pages/index.astro`, and passed down to `Nav` and `Footer`.

## Structure

```
website/
├─ src/
│  ├─ pages/index.astro       ← the landing page (all copy + sections here)
│  ├─ components/             ← Nav, Footer, Logo, SectionMarkers, SectionBoundaryMarks
│  │  └─ props.ts             ← shared prop types
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

- The Audience, Belief, Solution, Credibility, and CTA sections on the page currently render with no content — only Hero and Problem have real copy right now.
- `preview.html`, if present, is a local single-file snapshot for eyeballing — it is git-ignored and not part of the build. The real site is generated from `src/` by `npm run build`.
