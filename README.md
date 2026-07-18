# Velidion — website

Marketing site for [velidion.com](https://velidion.com). Static [Astro](https://astro.build) site — fast, SEO-friendly, deploys anywhere for free.

Current state: a single company landing page (pre-product) whose job is to (a) position the company and (b) convert visitors into discovery conversations and an email list. Matches the 90-day roadmap in `company-hq` (`strategy/working-assumptions.md`).

## Quick start

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # static output to ./dist
npm run preview  # preview the production build locally
```

Requires Node 18+ (built and tested on Node 22).

## Before you go live — three placeholders to fill

All three live at the top of `src/pages/index.astro`:

1. `CALENDAR_URL` — your booking link (e.g. a free [Cal.com](https://cal.com) or Calendly). Powers the "Book a conversation" button.
2. `CONTACT_EMAIL` — the inbox for replies (e.g. `hello@velidion.com`; set this up wherever your domain email lives).
3. `EMAIL_FORM_ACTION` — the endpoint the email-capture form POSTs to. Sign up for a free form/newsletter service — [Formspree](https://formspree.io), [Buttondown](https://buttondown.email), [ConvertKit](https://kit.com), or [Tally](https://tally.so) — and paste its form action URL. Until you do, the form renders but shows a setup note instead of submitting.

Nothing else is required — the copy and design are complete.

## Structure

```
website/
├─ src/
│  ├─ pages/index.astro      ← the landing page (all copy + sections here)
│  ├─ layouts/Layout.astro   ← <head>, meta/SEO/OpenGraph, fonts
│  └─ styles/global.css      ← brand system (colors, type, components)
├─ public/favicon.svg        ← the mark
├─ astro.config.mjs          ← site URL
└─ package.json
```

The design palette intentionally matches the market-study charts in `company-hq` (steel blue `#2f6f8f`, ink `#1a2b3c`) so the brand is consistent across everything.

## Deploy — GitHub Pages (free with your GitHub Pro plan)

This repo is already wired for GitHub Pages:

- `.github/workflows/deploy.yml` builds the site with the official `withastro/action` and publishes it on every push to `main`.
- `public/CNAME` pins the custom domain (`velidion.com`) so it survives every deploy.

The one-time setup (GitHub settings + DNS at Namecheap) is documented step by step in `GO-LIVE.md`. Follow that once; after it's done, every `git push` to `main` redeploys the site automatically.

## Notes

- The three stats on the page are sourced (links in the footer) — keep that; credibility matters in a trust-driven market.
- `preview.html`, if present, is a local single-file snapshot for eyeballing — it is git-ignored and not part of the build. The real site is generated from `src/` by `npm run build`.
