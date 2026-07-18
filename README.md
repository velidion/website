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
│  ├─ pages/index.astro       ← the landing page (all copy + sections here)
│  ├─ components/             ← Nav, Footer, Logo — shared across the page
│  ├─ layouts/Layout.astro    ← <head>, meta/SEO/OpenGraph, fonts
│  └─ styles/
│     ├─ tokens.css           ← brand colors/type, vendored from design-system/tokens/
│     └─ global.css           ← components built on those tokens
├─ public/logo-mark.png       ← web-sized derivative of the brand mark (v0.1.2)
├─ public/favicon.png, apple-touch-icon.png
├─ astro.config.mjs           ← site URL
└─ package.json
```

Colors, type, and the logo come from the `design-system` repo — the source of truth for the brand lives there, not here. `src/styles/tokens.css` is a verbatim copy of `design-system/tokens/colors.css` and `tokens/typography.css`; if the brand system changes, update it there first, then copy the values over.

## Deploy — GitHub Pages (free; repo is public)

> Pages from a private repo owned by an org needs a paid plan, so this repo is published public. That's fine for a marketing site — no secrets here, and `company-hq` stays private.

This repo is already wired for GitHub Pages:

- `.github/workflows/deploy.yml` builds the site with the official `withastro/action` and publishes it on every push to `main`.
- `public/CNAME` pins the custom domain (`velidion.com`) so it survives every deploy.

GitHub Pages settings (source = GitHub Actions) and DNS at your registrar are one-time setup outside this repo — every `git push` to `main` redeploys automatically once that's done.

## Notes

- The three stats on the page are sourced (links in the footer) — keep that; credibility matters in a trust-driven market.
- `preview.html`, if present, is a local single-file snapshot for eyeballing — it is git-ignored and not part of the build. The real site is generated from `src/` by `npm run build`.
