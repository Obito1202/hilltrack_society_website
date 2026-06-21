# Auth Testing — Hilltrack NGO

## Credentials
- username: `admin`
- password: `hilltrack2026`

## Tests
1. POST /api/auth/login with valid body returns `{token, username}`.
2. GET /api/auth/me with `Authorization: Bearer <token>` returns `{username, role}`.
3. Wrong password returns 401.
4. Protected mutation endpoints (POST/PUT/DELETE on /members, /events, /achievements, /schools, /gallery, PUT /settings, /upload) require Bearer token, return 401 without it.
5. Public GETs (/members, /events, /achievements, /schools, /gallery, /settings) work without auth.
