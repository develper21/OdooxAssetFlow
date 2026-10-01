# 🧠 Project Memory

**AssetFlow – Context, Progress & Important Notes**

This document keeps track of the current state of the project, important decisions and things to remember. It helps maintain continuity across development sessions or for new contributors.

| 📅 **Last Updated** | 👤 **Current Phase** | 🎯 **Overall Progress** |
| :---: | :---: | :---: |
| **Oct 1, 2026** — 11:30 AM | **Phase 9** — Deployment | **88%** (36/41 tasks) |

---

## 🎯 Current Status

- [x] Monorepo setup complete (`server/` Express API + `Website/` React SPA)
- [x] Backend complete — 12 models, 15 route groups, JWT auth, security hardening
- [x] Frontend complete — 11 modules, strict TypeScript, neumorphic UI
- [x] Type-safety & lint cleanup done (`react-hook-form` pinned to 7.88.0)
- [x] Deploy fixes done — Render build script + lockfile, Netlify secrets scan
- [ ] Working on: verifying production deploys (Render + Netlify)

## ✅ Completed Tasks

| # | Task | Completed On |
| --- | --- | --- |
| 1 | Express API scaffolding & MongoDB connection | Jul 12, 2026 |
| 2 | Authentication (JWT cookies, RBAC, rate limiting) | Jul 18, 2026 |
| 3 | Asset, category, allocation, transfer & booking modules | Jul 28, 2026 |
| 4 | Maintenance, audit, notification & report modules | Aug 5, 2026 |
| 5 | React SPA with all module pages (neumorphic UI) | Aug 5, 2026 |
| 6 | Strict TypeScript cleanup + ESLint 0 errors | Sep 24, 2026 |
| 7 | Postman collection for all endpoints | Sep 24, 2026 |
| 8 | Render deployment config (`render.yaml`) | Sep 24, 2026 |
| 9 | Netlify config (SPA redirects, headers, caching) | Sep 24, 2026 |
| 10 | Deploy fixes — build script, lockfile, secrets scan | Oct 1, 2026 |

## 🔄 In Progress

| # | Task | Started On |
| --- | --- | --- |
| 9.5 | Verify production deploys end-to-end (Render + Netlify) | Sep 25, 2026 |

## 📌 Important Notes

Things that are easy to get wrong — check here before touching related code.

| 📌 Note | Detail |
| --- | --- |
| 🍃 Env var names | Backend uses `MONGO_URI` (**not** `MONGODB_URI`), `JWT_SECRET`, `JWT_EXPIRE`, `JWT_COOKIE_EXPIRE`, `CLIENT_URL`, `SMTP_*` |
| 🧭 API surface | Base path `/api/v1` (15 route groups); health check at `/api/health` returns `{ success, message, timestamp }` |
| 🌍 CORS | `CLIENT_URL` accepts a **comma-separated** origin list; parsed in `server/src/app.js` |
| 🚦 Rate limits | Limiters respond with HTTP **429**; auth limiter is applied on auth routes only (no global limiter) |
| 🌱 Seeders | Import-safe via `require.main === module` guard — run explicitly: `npm run seed:admin` |
| 🪝 Forms | `react-hook-form` is **pinned to 7.88.0** — 7.81.0 shipped broken type definitions |
| 🔐 Netlify | Set `VITE_API_URL` in the **Netlify UI** (never hardcode it in repo files); `SECRETS_SCAN_OMIT_KEYS=VITE_API_URL` lives in `netlify.toml` |
| 🚂 Render | Build = `npm run build` (installs deps), start = `npm start`, health check `/api/health`; `server/package-lock.json` is now tracked |
| 😴 Free tier | Render free services sleep after inactivity — the first request can take ~30s to wake up |

## 💡 Next Up

1. Verify both production deploys end-to-end (task 9.5)
2. CI pipeline with typecheck, lint & build on every push
3. Automated tests for API and critical UI flows
4. Code-split the ~834 kB main bundle

---

> 🧠 Update this file at the end of every significant work session — it is the first thing a new session (human or AI) should read.
