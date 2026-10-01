# 🎨 Design System

**AssetFlow – Soft. Focused. Enterprise-ready.**

This document defines the visual design system, UI components, and user experience patterns for AssetFlow. The goal is a modern, minimal, **neumorphic ("Soft UI")** interface with a consistent, accessible component language across every module.

---

## 1. Design Principles

| 👥 User-Centered | 🍃 Minimal & Clean | 🧩 Consistent |
| :---: | :---: | :---: |
| **Simple and intuitive** for admins, managers and employees — no training needed. | **Reduce clutter** and focus on the data that matters: assets, people, dates, statuses. | **Follow one unified system** — the same cards, badges and tables everywhere. |

## 2. Color Palette

All colors are defined as CSS custom properties in `oklch` inside [`Website/src/styles.css`](../Website/src/styles.css) and mapped to Tailwind tokens (`bg-primary`, `text-muted-foreground`, …). Light and dark themes ship side by side.

### Brand & semantic colors

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| 🟣 **Primary** | `oklch(0.72 0.12 285)` lavender | `oklch(0.85 0.08 285)` · `#C7C6FF` | Main brand color — buttons, active nav, links |
| ⬜ **Background** | `oklch(0.945 0.004 265)` · `#EBECF0` | `oklch(0.26 0 0)` · `#2C2C2C` | App background |
| 🃏 **Card / Surface** | `oklch(0.965 0.003 265)` · `#F1F2F6` | `oklch(0.30 0 0)` | Cards, tables, popovers, sidebar |
| 🌫️ **Muted** | `oklch(0.93 0.005 265)` | `oklch(0.34 0 0)` | Subtle backgrounds, secondary text |
| 🔴 **Destructive** | `oklch(0.62 0.22 25)` | `oklch(0.65 0.22 25)` | Delete actions, error states |
| 📊 **Charts** | `chart-1 … chart-5` | — | Dashboard visualizations |

### Status badge tones

Statuses are rendered with the `Badge` component and mapped automatically by `toneForStatus` in `Website/src/components/layout/ui.tsx`:

| Tone | Style | Example statuses |
| --- | --- | --- |
| ✅ `success` | `emerald-500/15` | Available, Completed, Approved, Returned, Active, Resolved, Confirmed |
| ⚠️ `warn` | `amber-500/15` | Pending, Planned, In Progress, Assigned, Running |
| ⛔ `danger` | `rose-500/15` | Retired, Cancelled, Returned Late, Failed |
| 🔵 `primary` | `primary/20` | Allocated, Under Maintenance |
| ⚪ `neutral` | `muted` | Anything else / unknown |

## 3. Typography

Two font families, loaded as CSS variables: `--font-sans` (body) and `--font-display` (headings).

| Font | Role | Notes |
| --- | --- | --- |
| **Inter** | Primary font — body text, tables, forms, buttons | Clean, modern, highly readable at small sizes |
| **Sora** | Display font — page titles, section headings, stat numbers | Geometric, distinctive; applied automatically to `h1–h5` |

### Type scale

| Element | Style | Size |
| --- | --- | --- |
| Page title | `text-2xl md:text-3xl font-semibold` (Sora) | 24–30px |
| Section heading | `text-lg font-semibold` (Sora) | 18px |
| Body / table text | `text-sm` (Inter) | 14px |
| Stat value | `font-display text-3xl md:text-4xl font-semibold` | 30–36px |
| Caption / table header | `text-xs uppercase tracking-wider` | 12px |

## 4. UI Components

Standard components used throughout the app — all defined in `Website/src/components/layout/ui.tsx` unless noted.

| Component | Purpose | Notes |
| --- | --- | --- |
| `PageHeader` | Title + subtitle + action buttons on every page | Consistent page top across modules |
| `NeuCard` | Raised neumorphic surface for content sections | Uses the `neu` utility |
| `StatCard` | Dashboard KPI tiles | `neu` surface or `neu-accent` gradient variant |
| `Badge` | Status chips with 5 tones | Colors come from the palette table above |
| `DataTable` | Consistent tables | Uppercase header, rounded row cards, built-in empty state |
| `ViewModeSwitcher` | List / Grid / Kanban toggle | `neu-inset` pill, used on asset-heavy pages |
| Forms | react-hook-form + zod | Labeled inputs, custom select chevron, inline errors |
| Dialogs & menus | Radix UI primitives (shadcn-style) | Accessible focus handling out of the box |
| Toasts | `sonner` | Success / error feedback for every mutation |
| Icons | `lucide-react` | 16–20px, 1.5–2px stroke, always paired with text |

### Buttons

| Variant | Style | Usage |
| --- | --- | --- |
| **Primary** | `neu-accent` gradient (lavender) | Main action on a page — Save, Allocate, Create |
| **Secondary** | `neu` surface with border | Cancel, secondary actions |
| **Destructive** | `destructive` red | Delete, retire, cancel records |

## 5. Neumorphic (Soft UI) Language

The signature look: **soft raised surfaces instead of hard borders**, defined as Tailwind v4 utilities in `styles.css`.

| Utility | Effect | Use for |
| --- | --- | --- |
| `neu` | Large soft outer shadow (raised) | Cards, panels, sidebar |
| `neu-sm` | Small soft outer shadow | Table rows, small chips, buttons |
| `neu-inset` | Soft inset shadow (pressed) | Inputs, segmented controls, toggles |
| `neu-accent` | Lavender gradient + soft shadow | Primary buttons, active states, KPI highlights |

**Rules of thumb**

- Never combine a neumorphic shadow with a hard 1px border — pick one.
- Don't nest more than two shadow levels; it muddies the depth cue.
- Radius comes from `--radius: 0.9rem` (rounded-xl family).
- Dark mode swaps shadow colors automatically via the `.dark` theme block.

---

> 💡 All new UI must reuse these tokens and components. Hardcoded hex values in components are not allowed — add a token to `styles.css` instead.
