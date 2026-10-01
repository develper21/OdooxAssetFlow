# 🏛️ System Architecture

**AssetFlow – Enterprise Asset & Resource Management System**

This document describes the overall system architecture, technology stack, folder structure, data flow, and key design decisions for the AssetFlow application.

---

## 1. High-Level Architecture

AssetFlow follows a classic client–server architecture. The React SPA and the Express API are deployed as **two independent services** that communicate over a REST API.

```text
┌────────────────┐   HTTPS + JWT     ┌─────────────────────┐   REST /api/v1    ┌─────────────────────┐
│      User      │  (httpOnly cookie)│   React Frontend    │  (JSON, typed)    │     Express API     │
│   (Browser)    │ ◄────────────────►│  (Vite SPA + TS)    │ ◄────────────────►│  (Node.js + Express)│
└────────────────┘                   └─────────────────────┘                   └──────────┬──────────┘
      Netlify (hosting)                                                                  │
                                                                           ┌─────────────┴─────────────┐
                                                                           │                           │
                                                                    ┌──────▼──────┐             ┌──────▼───────┐
                                                                    │   MongoDB   │             │ SMTP / Media │
                                                                    │    Atlas    │             │ Nodemailer + │
                                                                    │  (Mongoose) │             │   Multer     │
                                                                    └─────────────┘             └──────────────┘
```

- **Frontend** — static SPA built by Vite, hosted on **Netlify**, calls the API via `VITE_API_URL`
- **Backend** — Express API hosted on **Render**, health check at `/api/health`, all routes under `/api/v1`
- **Database** — MongoDB Atlas, accessed exclusively through Mongoose models
- **Stateless auth** — JWT in httpOnly cookies, so the API scales horizontally

## 2. Technology Stack

Technologies used in the project and their purpose.

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 19 + Vite 8 | UI framework and dev tooling |
| Language | TypeScript 5.8 (strict) | Type safety and better developer experience |
| Styling | Tailwind CSS v4 | Utility-first styling with design tokens |
| UI Kit | Radix UI + lucide-react | Accessible primitives and icons |
| Server state | TanStack Query | Data fetching, caching and invalidation |
| Forms | react-hook-form + zod | Typed forms and schema validation |
| Routing | React Router v7 | Client-side navigation |
| Charts | Recharts | Dashboard visualizations |
| Backend | Node.js + Express 4 | REST API server |
| Database | MongoDB + Mongoose 8 | Persistence and schema modeling |
| Auth | JWT (httpOnly cookies) + bcryptjs | Stateless auth and password hashing |
| Email | Nodemailer (SMTP) | Password reset and notification emails |
| Uploads | Multer (+ Cloudinary optional) | Asset images and attachments |
| Security | helmet, CORS, express-rate-limit, mongo-sanitize, hpp, express-validator | API hardening |
| Hosting | Netlify (SPA) + Render (API) | Deployment |
| Version Control | Git + GitHub | Source code management |

## 3. Folder Structure

The project is a monorepo with two apps and a shared `docs/` folder.

```text
OdooxAssetFlow/
├── docs/                    # Project documentation (PRD, ARCHITECTURE, RULES, DESIGN, TASKS, MEMORY)
├── render.yaml              # Render blueprint for the API service
├── server/                  # Express + MongoDB backend API
│   └── src/
│       ├── config/          # DB connection, environment & Cloudinary setup
│       ├── constants/       # HTTP status codes and enums
│       ├── controllers/     # Request handlers per resource (thin)
│       ├── middlewares/     # auth, roles, errors, rate limiter, upload, validation
│       ├── models/          # 12 Mongoose schemas (single source of DB truth)
│       ├── routes/          # 15 route groups mounted under /api/v1
│       ├── seeds/           # Admin & mock data seeders (import-safe)
│       ├── services/        # Business logic reused by controllers
│       ├── validators/      # express-validator chains per resource
│       ├── utils/           # AppError, JWT, email and other helpers
│       ├── app.js           # Express app — CORS, helmet, parsers, routes
│       └── server.js        # Entry point — connect DB, listen on PORT
└── Website/                 # React + Vite + TypeScript SPA
    └── src/
        ├── components/      # Layout shell & shared UI (ui.tsx)
        ├── routes/          # Pages — auth/ (login, signup) and app/ (modules)
        ├── hooks/           # Custom React hooks
        ├── lib/             # Typed API client (api.ts) & utilities
        ├── types/           # Shared domain TypeScript types
        ├── main.tsx         # Bootstrap — router, providers, theme
        └── styles.css       # Tailwind v4 theme + neumorphic utilities
```

## 4. Data Model

12 Mongoose models grouped by domain:

| Domain | Models |
| --- | --- |
| Identity | `User` (roles: admin / manager / employee), `Department` |
| Assets | `Asset`, `AssetCategory` |
| Lifecycle | `Allocation`, `Transfer`, `Booking` |
| Operations | `MaintenanceRequest`, `AuditCycle`, `AuditItem` |
| Platform | `Notification`, `ActivityLog` |

> 📌 Employees are users with the `employee` role; the employee directory is served through `/api/v1/employees`.

## 5. Data Flow (example — allocating an asset)

1. Manager clicks **Allocate** in the SPA → react-hook-form + zod validate the form
2. The typed API client sends `POST /api/v1/allocations` with the JWT cookie
3. Server chain: helmet → CORS whitelist → validator → auth middleware → role check → controller
4. The allocation service checks asset availability, creates the record, flips `Asset.status`
5. `Notification` and `ActivityLog` entries are written for accountability
6. TanStack Query invalidates the cache → UI refetches and renders the new state

## 6. Key Design Decisions

- **Two-service deployment** — SPA on Netlify, API on Render; both configured in-repo (`Website/netlify.toml`, `render.yaml`)
- **JWT in httpOnly cookies** — XSS-safe storage, stateless verification on every request
- **Consistent response envelope** — every endpoint returns `{ success, message, data }`
- **Central error handling** — controllers throw `AppError`; one error middleware formats responses
- **Role-based access in middleware** — never ad-hoc checks inside components
- **ActivityLog on every write** — complete audit trail for accountability

---

> 💡 Folder or stack changes must be reflected here before implementation starts (see [`RULES.md`](RULES.md)).
