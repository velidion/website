# Go live: velidion.com on GitHub Pages

Follow these once, top to bottom. Everything here is free. After the one-time setup, every `git push` to `main` redeploys the site automatically.

> **Repo visibility note.** GitHub Pages from a *private* repo owned by an **organization** requires a paid plan (Team/Enterprise) — personal Pro doesn't cover org repos. So this repo is published **public** (Step 3 below). That's standard for a marketing site: the deployed page is public anyway, and there are no secrets in this repo. Your private material (strategy, finance) lives in the separate `company-hq` repo, which stays private.

Estimated time: ~20 minutes of work, then up to a few hours (occasionally up to 24h) of waiting for DNS to propagate.

---

## Step 1 — Fill the three placeholders (do this first)

Open `src/pages/index.astro` and edit the block at the very top:

```js
const CALENDAR_URL = 'https://cal.com/velidion/intro'; // your booking link
const CONTACT_EMAIL = 'hello@velidion.com';            // your inbox
const EMAIL_FORM_ACTION = '';                          // your form endpoint
```

- `CALENDAR_URL` — sign up at [cal.com](https://cal.com) (free), create a 30-min event, paste its link. This powers the "Book a conversation" button.
- `CONTACT_EMAIL` — the address people email you at. If you want `hello@velidion.com`, set up email forwarding for the domain in Namecheap (Domain List → Manage → **Redirect Email** → add `hello@` → forward to your Gmail). Or just use your Gmail here for now.
- `EMAIL_FORM_ACTION` — sign up at [Formspree](https://formspree.io) (free tier), create a form, copy its endpoint (looks like `https://formspree.io/f/abcdwxyz`), paste it in. This makes the "Get updates" form actually collect emails. (Alternatives: Buttondown, ConvertKit, Tally.)

You *can* launch before wiring these up — the page still renders — but the two CTAs are the whole point of the page, so it's worth doing now.

---

## Step 2 — Push the code to GitHub

From inside this folder (`velidion/website`):

```bash
git add .
git commit -m "Initial landing page + GitHub Pages deploy"
git push -u origin main
```

If `git push` asks for credentials, use a GitHub personal access token as the password (GitHub no longer accepts your account password over HTTPS), or set up the GitHub CLI / SSH — whichever you already use.

---

## Step 3 — Make the repo public, then turn on GitHub Pages

**3a. Make the repo public** (required — see the visibility note at the top):

1. Repo → **Settings** → scroll to the bottom → **Danger Zone**.
2. **Change repository visibility** → **Change to public** → confirm by typing the repo name.

**3b. Enable Pages:**

1. Still in **Settings** → **Pages** (left sidebar).
2. Under **Build and deployment → Source**, select **GitHub Actions**.

That's it for this screen. Pushing in Step 2 already kicked off the deploy workflow; setting the source lets it publish.

Check progress under the repo's **Actions** tab — you'll see "Deploy to GitHub Pages" running. When it's green, your site is live at the temporary GitHub URL (shown in the workflow's `deploy` step). If the very first run failed because Pages wasn't enabled yet, just re-run it: Actions → the failed run → **Re-run all jobs**.

---

## Step 4 — Point your domain at GitHub (DNS at Namecheap)

1. [Namecheap](https://www.namecheap.com) → **Domain List** → **Manage** next to `velidion.com` → **Advanced DNS** tab.
2. Under **Host Records**, **delete** the two default parking records Namecheap adds (a `CNAME` for `www` pointing to `parkingpage.namecheap.com`, and a `URL Redirect` for `@`).
3. Add these records (Type / Host / Value / TTL = Automatic):

   **Four A records — apex domain:**

   | Type | Host | Value |
   |------|------|-------|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |

   **One CNAME record — www subdomain:**

   | Type | Host | Value |
   |------|------|-------|
   | CNAME | www | velidion.github.io. |

   **(Optional but recommended) four AAAA records for IPv6 — apex:**

   | Type | Host | Value |
   |------|------|-------|
   | AAAA | @ | 2606:50c0:8000::153 |
   | AAAA | @ | 2606:50c0:8001::153 |
   | AAAA | @ | 2606:50c0:8002::153 |
   | AAAA | @ | 2606:50c0:8003::153 |

4. Save. DNS changes can take anywhere from a few minutes to a few hours (rarely up to 24h) to propagate. You can watch progress at [dnschecker.org](https://dnschecker.org) — search `velidion.com`, type A, and wait until you see those four GitHub IPs.

---

## Step 5 — Attach the custom domain in GitHub

The repo already contains a `CNAME` file (in `public/`), so the domain is baked into every build. Now tell GitHub about it so it issues the HTTPS certificate:

1. Repo → **Settings** → **Pages**.
2. Under **Custom domain**, enter **`velidion.com`** and click **Save**.
3. GitHub runs a DNS check. Once your Step 4 records have propagated, it turns green ("DNS check successful"). If it errors immediately, DNS just hasn't propagated yet — wait and it'll clear on its own.
4. When the green check appears, tick **Enforce HTTPS**. (This box only becomes available after GitHub finishes provisioning the free TLS certificate — that can take up to ~15 minutes after the DNS check passes.)

---

## Step 6 — Confirm it's working

Once DNS + HTTPS are done:

- Visit **https://velidion.com** — the page should load over HTTPS with the padlock.
- **https://www.velidion.com** should redirect to the apex automatically.
- Click **Book a conversation** — confirm it opens your Cal.com page.
- Submit a test email in **Get updates** — confirm it lands in your Formspree dashboard.
- Email **hello@velidion.com** (or whatever you set) — confirm it reaches your inbox.

---

## After launch: how to update the site

Just edit and push — the workflow handles the rest:

```bash
# make your edits, then:
git add .
git commit -m "Update landing page copy"
git push
```

Every push to `main` rebuilds and redeploys within a couple of minutes. To preview changes locally before pushing: `npm run dev`.

---

## Troubleshooting

- **Actions run fails on the deploy step** — Pages source isn't set to "GitHub Actions" (Step 3), or the first run happened before you set it. Set it, then re-run the job.
- **"DNS check unsuccessful" in Pages settings** — DNS hasn't propagated yet. Confirm the four A records show up at [dnschecker.org](https://dnschecker.org), then re-save the custom domain.
- **Site loads but shows a 404** — the deploy hasn't finished, or `public/CNAME` was removed. Confirm the Actions run is green and `public/CNAME` still contains `velidion.com`.
- **"Enforce HTTPS" is greyed out** — the certificate is still being issued. Wait ~15 minutes after the DNS check passes and refresh.
- **(Optional) prevent domain takeover** — in your GitHub **organization** settings → Pages, you can "Verify" `velidion.com`. Not required, but good hygiene.
