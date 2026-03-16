# Downloads Dashboard — Implementation Plan

## Goal
Admin-only dashboard to visualize and explore all download leads. Accessible on desktop and mobile.

## Current State
- **Download leads** are stored in SQLite table `download_leads` with fields: `id`, `name`, `email`, `company_name`, `country`, `version`, `filename`, `platform`, `downloaded_at`
- **Existing API**: `GET /api/v1/download-leads` returns all leads (flat list, no auth guard)
- **Auth**: JWT-based, admin role check via `useAuth()` context (`user.role === 'admin'`)
- **Charts**: `recharts` already in dependencies
- **Admin pattern**: `/admin/users` page already exists as reference

---

## Plan

### 1. Backend — New API endpoints (Rust / Axum)

Add two new endpoints in `download_handlers.rs` and register them in `routes.rs`:

| Endpoint | Purpose |
|---|---|
| `GET /api/v1/download-leads/stats` | Aggregated stats: total downloads, downloads per day (last 30 days), per month, per platform, per country, per version. Single endpoint returning all aggregations. |
| `GET /api/v1/download-leads?page=1&search=` | Add pagination + search (by name/email/company) to the existing list endpoint |

Both endpoints will require **admin auth** (JWT token with admin role), using the same auth middleware already used by `/api/v1/users`.

**Stats response shape:**
```json
{
  "total": 142,
  "today": 5,
  "this_month": 38,
  "per_day": [{ "date": "2026-03-01", "count": 12 }, ...],
  "per_month": [{ "month": "2026-01", "count": 45 }, ...],
  "per_platform": [{ "platform": "windows", "count": 80 }, ...],
  "per_country": [{ "country": "US", "count": 30 }, ...],
  "per_version": [{ "version": "0.3.0", "count": 60 }, ...],
  "top_companies": [{ "company": "Acme", "count": 5 }, ...],
  "recent": [{ "name": "John", "email": "...", "downloaded_at": "...", ... }]
}
```

### 2. Frontend — New page `/admin/downloads`

Create `pages/AdminDownloadsPage.tsx` — a single responsive page with these sections:

#### a) KPI Cards (top row)
- Total downloads (all time)
- Downloads today
- Downloads this month
- Unique companies

#### b) Charts row (responsive: stack on mobile)
- **Downloads over time** — Line chart (daily for last 30 days, toggle to monthly view)
- **Downloads by platform** — Pie/donut chart (Windows / macOS / Ubuntu)

#### c) Secondary charts row
- **Downloads by country** — Horizontal bar chart (top 10)
- **Downloads by version** — Bar chart

#### d) Full downloads table (bottom)
- Columns: Date, Name, Email, Company, Country, Platform, Version
- Search box (filters by name/email/company)
- Pagination
- Sortable by date (newest first by default)
- On mobile: horizontal scroll or card layout

### 3. Routing & Navigation

- Add route `/admin/downloads` in `App.tsx`
- Add a link in the admin nav (or sidebar) alongside the existing `/admin/users` link
- Guard: redirect non-admin users (same pattern as `AdminUsersPage`)

### 4. Styling

- Use the existing Tailwind CSS setup (consistent with current admin page)
- Mobile-first responsive: cards stack vertically, charts resize, table becomes scrollable
- Dark theme consistent with the rest of the site

### 5. API Client

- Add functions in `components/community/api.ts` (or a new `api/admin.ts`):
  - `fetchDownloadStats()` — calls `/api/v1/download-leads/stats`
  - `fetchDownloadLeads(page, search)` — calls `/api/v1/download-leads?page=X&search=Y`

---

## Files to modify

| File | Change |
|---|---|
| `crates/odarax-api/src/download_handlers.rs` | Add `download_leads_stats` handler, add pagination/search to `list_download_leads` |
| `crates/odarax-api/src/storage/db.rs` | Add `get_download_stats()` and update `list_download_leads()` with pagination/search |
| `crates/odarax-api/src/routes.rs` | Register new `/download-leads/stats` route with admin auth |
| `pages/AdminDownloadsPage.tsx` | **New file** — full dashboard page |
| `App.tsx` | Add route for `/admin/downloads` |
| `components/community/api.ts` | Add `fetchDownloadStats()` and `fetchDownloadLeads()` |

## Files NOT modified
- No changes to the public download page or download flow
- No new npm dependencies (recharts + tailwind already available)

---

## Estimated scope
- Backend: ~150 lines of Rust (stats queries + handler)
- Frontend: ~400 lines of React/TypeScript (dashboard page)
- Small edits to routing and API client (~20 lines)
