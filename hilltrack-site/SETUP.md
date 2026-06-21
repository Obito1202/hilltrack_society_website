# Quick Start — 5 steps

> Full guide is in [`README.md`](./README.md). This is the cheat sheet.

## Step 1 — Install Node.js (one time, on your laptop)
Download from https://nodejs.org (pick the **LTS** version), install it.

## Step 2 — Get the code on your laptop
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>/hilltrack-site
npm install
```

## Step 3 — Edit your content
```bash
npm run admin
```
Open **http://localhost:5174/admin/** in your browser.  
Add events, members, photos, etc. Click **Save** after every change.  
When done, press **Ctrl+C** in the terminal to stop the admin.

## Step 4 — Preview the public site (optional)
```bash
npm run dev
```
Open http://localhost:5173 — this is what visitors will see.

## Step 5 — Publish to the world
```bash
git add .
git commit -m "Updated events for March"
git push
npm run deploy:gh
```
Done. Your live site updates in about a minute.

---

## Where things live

| What | Where |
|------|-------|
| Your content (events, members, etc.) | `public/data/*.json` |
| Your uploaded photos | `public/uploads/` |
| Site design / colours / fonts | `src/index.css` |
| Page layouts | `src/pages/*.jsx` |

## Common questions

**I forgot the admin URL.** It's always `http://localhost:5174/admin/` after `npm run admin`.

**Can the public see the admin?** No — it only runs on `localhost`, on **your** laptop.

**I'm on a new computer.** Just `git clone` the repo again, then `npm install`, then `npm run admin`. All your content is in GitHub.

**The site looks broken after deploy.** Make sure GitHub Pages is set to **Settings → Pages → Source = `gh-pages` branch**.

**I want a custom domain (e.g. `www.hilltrack.org`).** Buy the domain at any registrar (Namecheap, GoDaddy, Cloudflare), then in your GitHub repo go to **Settings → Pages → Custom domain** and follow the on-screen DNS instructions.
