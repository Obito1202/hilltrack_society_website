# Hilltrack Society Website

A fully independent, static website for **Hilltrack Society for Education, Environment and Energy** (Nainital, Uttarakhand). Public site is pure HTML/CSS/JS, content lives as JSON files in this repo, and a small local-only admin tool lets you edit content without touching code.

> **No server, no database, no monthly bills.** Push to GitHub → site updates.

---

## What's inside

```
hilltrack-site/
├── public/
│   ├── data/          ← your content (members.json, events.json, settings.json, …)
│   └── uploads/       ← all photos you upload via the admin
├── src/               ← the public website (React + Vite)
├── admin/             ← local-only admin tool (Node + Express + tiny HTML)
└── package.json
```

---

## 1. One-time setup on your laptop

Install **Node.js 18+** (https://nodejs.org) and **Git** (https://git-scm.com), then in this folder run:

```bash
npm install
```

---

## 2. Editing content (your daily workflow)

```bash
npm run admin
```

Open **http://localhost:5174/admin/** in your browser. You'll see the same admin panel you had before:

- Tabs for **Members · Events · Achievements · Schools · Gallery · Site Settings**
- Add / edit / delete entries, upload photos
- Everything you save is written **directly to the JSON files** in `public/data/` and images go into `public/uploads/`.

When you're happy, stop the admin (Ctrl+C) and publish:

```bash
git add .
git commit -m "Added Solar Lighting Drive event"
git push
```

Within ~1 minute, your public site (GitHub Pages / Netlify / Vercel) shows the new content.

> The admin tool only runs **on your laptop**. Visitors to your live website never see it.

---

## 3. Preview the public site locally

```bash
npm run dev
```

Opens http://localhost:5173 — exactly what visitors will see.

---

## 4. Build & deploy to GitHub Pages

```bash
npm run build       # creates dist/ folder
npm run deploy:gh   # publishes dist/ to gh-pages branch
```

Then in your GitHub repo: **Settings → Pages → Source = `gh-pages` branch**. Your site goes live at  
`https://<your-username>.github.io/<repo-name>/`.

### Custom domain (e.g. `www.hilltrack.org`)
1. In your repo: **Settings → Pages → Custom domain** → enter `www.hilltrack.org`.
2. At your domain registrar, add a CNAME record: `www → <your-username>.github.io`.
3. Done — GitHub auto-issues a free SSL certificate.

---

## 5. Other hosts (Netlify, Vercel, Cloudflare Pages)

The build output is plain static files in `dist/`. Just point any host at this repo:
- Build command: `npm run build`
- Publish directory: `dist`
- Custom domains are supported on all of them.

---

## FAQ

**Can someone hack the admin?** No — the admin server only listens on `localhost`. It's never exposed to the internet.

**What if I lose my laptop?** Your content is safely in GitHub. Just clone the repo on a new machine and run `npm run admin` again.

**Can two people edit at the same time?** Yes — each editor clones the repo, makes changes, then `git pull` / `git push`. Git merges JSON cleanly as long as you don't both edit the same item.

**Where are the photos?** In `public/uploads/`. They are part of the repo and get committed with everything else.

**How do I change the design / colours / fonts?** Edit `src/index.css` (CSS variables at the top).

---

## Credits

Built originally on the Emergent platform, then converted to a fully static, GitHub-ready project for long-term independence.
