# 📄 Product Requirements Document (PRD)

**AssetFlow – Enterprise Asset & Resource Management**

This document defines the product requirements for AssetFlow — what we are building, for whom, and why. It is the single source of truth for features and scope of the MVP.

| Field | Value |
| --- | --- |
| **Version** | 1.0 |
| **Date** | Oct 1, 2026 |
| **Author** | Team AssetFlow |
| **Status** | MVP (v1.0) — in development |
| **Target Launch** | MVP (v1.0) |

---

## 1. Product Overview

AssetFlow is a web application designed to help organizations manage their physical assets — laptops, projectors, vehicles, tools, furniture and more — in one central place. It covers the complete asset lifecycle: inventory, allocation to employees, bookings/reservations, maintenance, periodic audits, notifications and reports.

## 2. Problem Statement

Organizations still track assets in spreadsheets, WhatsApp chats and paper registers. This leads to lost or "ghost" assets, zero accountability (nobody knows who has what), missed maintenance, duplicate purchases and painful, error-prone audits. Teams need a central, easy-to-use solution.

## 3. Goals

- Provide a single, central platform for the complete asset lifecycle
- Make every asset accountable — clear custodian and full allocation/transfer history
- Reduce asset loss and downtime with bookings, maintenance requests and audit cycles
- Offer a clean, modern, role-based interface for admins, managers and employees
- Deliver actionable reports and a live dashboard for decision makers

## 4. Target Users

- **IT & Admin teams** — asset managers in companies, institutes and offices
- **Department heads / managers** — approve bookings and track their team's assets
- **Employees** — see allocated assets, request bookings, report issues
- Organizations of 10–5,000 people; tech-savvy, uses laptops and smartphones
- Needs a simple, reliable tool that works in the browser — no training required

## 5. Core Features (MVP)

1. **User Authentication** (sign up / login, JWT with httpOnly cookies, roles: admin / manager / employee, forgot & reset password via email)
2. **Dashboard** (live stats — total / available / allocated / under-maintenance assets, category charts, recent activity)
3. **Asset Management** (CRUD for assets & categories, images, serial numbers, filters, search, status: available / allocated / maintenance / retired)
4. **Allocations & Transfers** (assign assets to employees, accept returns, transfer custody — full history preserved)
5. **Bookings** (reserve an asset for a date range with approve / reject workflow)
6. **Maintenance Requests** (raise, track and resolve maintenance with vendor & cost details)
7. **Audit Cycles** (periodic audits with per-asset audit items and verification status)
8. **Departments & Employees** (manage departments and the employee directory)
9. **Notifications** (in-app notifications for allocations, bookings, approvals and audits)
10. **Reports** (asset, allocation and maintenance reports with CSV export)

## 6. Out of Scope (v1.0)

- Native mobile apps (responsive web only)
- Barcode / QR / RFID scanning
- Procurement, invoicing and vendor payments
- Multi-tenant workspaces

## 7. Success Metrics

- ✅ 100% of in-use assets recorded with a current custodian
- ✅ Asset lookup & allocation done in under a minute
- ✅ On-time maintenance closure rate above 90%
- ✅ Audits completed without spreadsheet reconciliation

---

> 💡 This PRD drives the task breakdown in [`TASKS.md`](TASKS.md). Feature changes must be reflected here first.
