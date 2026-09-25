# 🚀 AssetFlow – Enterprise Asset & Resource Management System

> A modern ERP-style Asset & Resource Management platform built for the Odoo Hackathon.

AssetFlow is designed to simplify how organizations manage their physical assets and shared resources through a centralized web application. Instead of relying on spreadsheets or manual records, AssetFlow provides a structured workflow for tracking assets, managing allocations, booking shared resources, handling maintenance, running audits, and generating operational insights.

---

## 📖 Overview

Organizations often struggle to manage thousands of assets such as:

- 💻 Laptops
- 🖥️ Desktops
- 🪑 Furniture
- 🖨️ Printers
- 🚗 Vehicles
- 📽️ Projectors
- 🏢 Meeting Rooms
- 📦 Shared Equipment

Traditional asset tracking using Excel sheets and paperwork leads to:

- Asset loss
- Double allocation
- Manual maintenance tracking
- Resource booking conflicts
- Poor operational visibility
- Lack of audit history

AssetFlow solves these challenges through a centralized ERP platform with role-based workflows and real-time tracking.

---

# 🎯 Project Goal

Build a scalable Enterprise Asset & Resource Management System that enables organizations to:

- Register assets
- Track asset lifecycle
- Allocate assets
- Prevent duplicate allocation
- Manage maintenance workflow
- Book shared resources
- Perform asset audits
- Generate reports
- Monitor organization assets from one dashboard

---

# ✨ MVP Features

## 🔐 Authentication

- Login
- Employee Signup
- Forgot Password
- Session Management
- Role Based Access

---

## 📊 Dashboard

- Asset Overview
- KPI Cards
- Upcoming Returns
- Pending Transfers
- Maintenance Status
- Active Bookings

---

## 🏢 Organization Setup

- Departments
- Asset Categories
- Employee Directory
- Role Management

---

## 💻 Asset Registry

- Register Assets
- Asset Details
- Asset History
- Search
- Filters

---

## 🔄 Asset Allocation

- Allocate Asset
- Return Asset
- Transfer Requests
- Allocation History

---

## 📅 Resource Booking

- Calendar View
- Booking System
- Conflict Detection

---

## 🔧 Maintenance

- Raise Request
- Approval Workflow
- Technician Assignment
- Resolution Tracking

---

## 📋 Audit Management

- Audit Cycles
- Asset Verification
- Missing Assets
- Damaged Assets
- Discrepancy Reports

---

## 📈 Reports

- Asset Utilization
- Department Summary
- Maintenance Report

---

## 🔔 Notifications

- Asset Assigned
- Booking Reminder
- Maintenance Updates
- Transfer Approval
- Audit Alerts

---

# ⭐ Bonus Features

Implemented only if hackathon time permits.

- QR Code Support
- Advanced Analytics
- Dashboard Charts
- Asset Heatmaps
- PDF Export
- Dark Mode
- Better Search
- Better Reports
- Mobile Optimizations

---

# 👥 User Roles

## Admin

- Organization Setup
- Employee Management
- Department Management
- Reports
- Dashboard

---

## Asset Manager

- Register Assets
- Asset Allocation
- Maintenance Approval
- Audit Management

---

## Department Head

- Department Assets
- Approvals
- Resource Booking

---

## Employee

- My Assets
- Resource Booking
- Raise Maintenance
- Return Assets

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS
- shadcn/ui

## Backend (Upcoming)

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM

---

# 📂 Project Structure

```
AssetFlow/
│
├── Docs/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── components/
│   ├── routes/
│   ├── hooks/
│   ├── lib/
│   └── ...
│
└── Backend/ (Coming Soon)
```

---

# 🚧 Development Roadmap

## Phase 1

✅ Frontend Development

- UI
- Components
- Pages
- Navigation
- Responsive Design

---

## Phase 2

✅ Backend Development

- Authentication
- Database
- APIs
- Business Rules

---

## Phase 3

✅ Integration

- Connect APIs
- Testing
- Bug Fixes

---

## Phase 4

✅ Hackathon Submission

- Demo
- Documentation
- Deployment

---

# 🤝 Contributing

Contributions, suggestions and feedback are welcome.

Feel free to fork the repository and submit pull requests.

---

# 📄 License

This project is developed for the **Odoo Hackathon**.

---

# 🌍 Deployment

The project deploys as two services:

| Component | Platform | Config file | Root directory |
|---|---|---|---|
| Backend API (Express + MongoDB) | **Render** | [`render.yaml`](render.yaml) | `server/` |
| Frontend SPA (React + Vite) | **Netlify** | [`Website/netlify.toml`](Website/netlify.toml) | `Website/` |

## 1. Backend → Render

1. Push the repo to GitHub, then in [Render](https://dashboard.render.com): **New → Blueprint** → pick the repo.
2. Fill in `MONGO_URI`, `CLIENT_URL` (your Netlify URL), and SMTP vars when prompted; `JWT_SECRET` is auto-generated.
3. After deploy, seed the admin once from the Render Shell: `npm run seed:admin`.
4. Note your API URL, e.g. `https://assetflow-api.onrender.com/api/v1`.

Details: [`server/README.md`](server/README.md).

## 2. Frontend → Netlify

1. In [Netlify](https://app.netlify.com): **Add new site → Import an existing project** → pick the repo.
2. Netlify reads `Website/netlify.toml` (base `Website`, build `npm run build`, publish `dist`, SPA redirects included).
3. Set the env var `VITE_API_URL` to the Render API URL from step 4 above.
4. Redeploy (or enable auto-deploy) — the site will call the backend with CORS-allowed origin.

## 3. Connect the two

- On Render, set `CLIENT_URL=https://<your-site>.netlify.app` (comma-separate extra origins like preview URLs).
- On Netlify, keep `VITE_API_URL=https://assetflow-api.onrender.com/api/v1`.
- Health check: `GET https://assetflow-api.onrender.com/api/health`.

> ℹ️ Render free tier spins the API down after inactivity; the first request after idle may take ~30s.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.