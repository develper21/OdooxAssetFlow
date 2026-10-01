# 📏 Development Rules

**AssetFlow – Project Guidelines for AI & Human Collaboration**

This document defines the development rules, coding standards, and best practices for the AssetFlow application. These rules ensure consistency, maintainability, security, and quality. Both AI assistants and human contributors must follow these guidelines.

---

## 1️⃣ General Principles

These rules apply to the entire project.

- [x] Follow the project documentation (PRD, ARCHITECTURE, DESIGN, TASKS) before making changes.
- [x] Keep the code clean, readable and well-structured.
- [x] Prioritize simplicity and maintainability.
- [x] Do not duplicate logic. Reuse existing components, utilities or services.
- [x] Make small, focused changes instead of large, risky edits.
- [x] Do not modify unrelated files.
- [x] Write self-explanatory code with meaningful variable and function names.
- [x] Never commit secrets — `.env` files stay git-ignored; real values live in the Render / Netlify dashboards.
- [x] Keep `main` deployable at all times; commit related changes together.

## 2️⃣ Technology & Coding Standards

Rules related to the tech stack and coding style.

| 📌 Area | Standard |
| --- | --- |
| 💻 Backend language | Plain Node.js (CommonJS) for the Express API — no TypeScript on the server. |
| ⚛️ Frontend language | Strict TypeScript. Avoid `any` unless absolutely necessary. |
| 🧱 Framework | Express: thin routes → controllers → services. React: function components and hooks only. |
| 🎨 Styling | Tailwind CSS v4 tokens + the neumorphic utilities (`neu`, `neu-sm`, `neu-inset`, `neu-accent`) from [`DESIGN.md`](DESIGN.md). |
| 🧭 API design | REST under `/api/v1`, consistent `{ success, message, data }` envelope, kebab-free resource names (`/allocations`, `/maintenance`). |
| 🛡️ Validation | Every mutating route has an express-validator chain in `server/src/validators`. |
| ⚠️ Error handling | Throw `AppError` and let the central error middleware respond. Never leak stack traces in production. |
| 🧹 Linting | ESLint (flat config) must pass with **0 errors** before merging. |
| 💅 Formatting | Prettier — run `npm run format`. No manual formatting debates. |
| 📦 Dependencies | Stable, well-maintained packages only. Pin versions when necessary (e.g. `react-hook-form@7.88.0`). Commit lockfiles. |
| 📝 File naming | Components `PascalCase.tsx`, hooks `useSomething.ts`, server files `camelCase.js` with dot suffixes (`asset.routes.js`). |

## 3️⃣ Project Structure

Follow the folder structure defined in [`ARCHITECTURE.md`](ARCHITECTURE.md) to keep the code organized and scalable.

- [x] Reusable UI lives in `Website/src/components` — module pages never duplicate it.
- [x] Pages belong in `Website/src/routes/{auth,app}` — one file per module page.
- [x] All API calls go through the typed client in `Website/src/lib/api.ts` — never `fetch` directly from components.
- [x] Shared domain types live in `Website/src/types` — no inline duplicates.
- [x] Backend business logic belongs in `server/src/services`; controllers stay thin.
- [x] Database access only through Mongoose models — no ad-hoc queries in routes.
- [x] Environment variables are read in `server/src/config` only.
- [x] Do not create new top-level folders without updating `ARCHITECTURE.md`.

## 4️⃣ Security & Environment

Non-negotiable rules for production safety.

- [x] Validate and sanitize every request (express-validator + mongo-sanitize + hpp).
- [x] Protect routes with the auth middleware; enforce roles (admin / manager / employee) in middleware, not in components.
- [x] Hash passwords with bcryptjs; keep JWTs in httpOnly, secure cookies.
- [x] Rate-limit auth endpoints — respond with HTTP **429** when limits are hit.
- [x] CORS allows only origins listed in `CLIENT_URL` (comma-separated list supported).
- [x] Seeds must never auto-run on import — guard with `require.main === module`.
- [x] Write an `ActivityLog` entry for every state-changing operation.

---

> 💡 When a rule must be broken, document the reason in [`MEMORY.md`](MEMORY.md) so future contributors understand the trade-off.
