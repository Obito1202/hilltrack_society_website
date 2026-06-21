# Hilltrack Society — PRD (Living Doc)

## Original problem statement
Create a NGO website for **Hilltrack Society for Education, Environment and Energy** (Nainital, Uttarakhand). The user wants to fill content locally (events, achievements, schools visited, members, gallery, etc.) with image uploads, save them, and have viewers see the published site without any editing options. Public visitors must not see edit controls.

User choices:
- Content stored in MongoDB (DB-backed, no GitHub auto-push)
- Hosted on Emergent preview/deploy
- All sections included
- Simple username + password JWT auth (single admin)
- Local image storage in the repo / backend filesystem

## Architecture
- **Backend**: FastAPI + Motor + MongoDB. JWT (Bearer) auth, bcrypt password hashing. File uploads stored in `/app/backend/uploads`, served via `/api/uploads/<file>` using StaticFiles.
- **Frontend**: React 19 + React Router 7 + Tailwind + shadcn/ui components. AuthContext stores Bearer token in localStorage.
- **Design**: Editorial, Cormorant Garamond + Outfit, palette = bone (#F9F6F0) / forest green (#1C3325) / terracotta accent (#C86A41).

## Endpoints (all under /api)
- Auth: POST /auth/login, GET /auth/me
- Members: GET /members (public), POST/PUT/DELETE /members[/:id] (admin)
- Events: GET /events (public), POST/PUT/DELETE /events[/:id] (admin)
- Achievements: same pattern
- Schools: same pattern
- Gallery: GET /gallery (public), POST /gallery (admin), DELETE /gallery/:id (admin)
- Settings: GET /settings (public), PUT /settings (admin)
- Upload: POST /upload (admin, multipart)

## Implemented (2026-02-21)
- Public site: Home (hero, stats, three pillars, CTA), About (aims & objectives auto-seeded), Governing Body (9 members auto-seeded from problem statement), Events, Achievements, Schools, Gallery, Contact, Donate.
- Admin: /admin/login, /admin dashboard with tabs (Members / Events / Achievements / Schools / Gallery / Site Settings).
- Image upload (PNG/JPG/WEBP/GIF) saved locally and served by FastAPI.
- Brute force / TTL not implemented (single admin, low-risk).
- Auto-seeded Governing Body and 13 default Aims & Objectives.
- Admin credentials: admin / hilltrack2026 (also in /app/memory/test_credentials.md).

## Backlog (P1)
- Multi-image upload per event/school (gallery within an item)
- Drag-and-drop reordering for members
- Email contact form on Contact page (Resend / SendGrid)
- Build production site export for GitHub Pages (the user's original idea — currently DB-backed)

## Backlog (P2)
- Rich-text descriptions (Markdown editor)
- Donation receipts / Razorpay integration
- Newsletter signup
- Public-facing search & tags

## Next Action Items
- Optionally wire Razorpay / UPI QR for one-click donations
- Optionally add a "Volunteer with us" form
