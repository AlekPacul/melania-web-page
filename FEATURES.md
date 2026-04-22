# Paroki Santa Melania — Feature Tracker

## Legend
- `[x]` Done / implemented
- `[-]` Stub / placeholder (UI exists, no real data)
- `[ ]` Not started

---

## Public Site

### Home (`/`)
- [x] Hero section — church photo, tagline, CTA buttons
- [x] Quick info card — weekly mass schedule summary (desktop)
- [x] About / History section — text + timeline milestones (1954–2018)
- [x] Scripture highlight banner
- [x] Ministries section — Ekaristi, Katekese, OMK cards
- [x] Daily Reflections section — 3 article cards (static/hardcoded)
- [x] Location section — address + embedded Google Maps iframe

### Mass Schedule (`/jadwal-misa`)
- [x] Weekly schedule table — live from Supabase
- [x] Eucharist preparation guidelines (4 cards)
- [x] WhatsApp CTA for more info
- [x] Error state when DB unavailable
- [x] Loading skeleton while fetching
- [x] Special/holiday mass schedule — `special_mass_schedules` table, public section on `/jadwal-misa`, admin tab on `/admin/jadwal-misa`

### Donation (`/donasi`)
- [x] Page stub — "Coming Soon" placeholder with WhatsApp fallback
- [x] Bank transfer info — BCA (777-393-777-1) + OCBC NISP (010-80000-665-1) general, OCBC NISP PPG (010-8000-18755)
- [x] Copy-to-clipboard for all account numbers
- [x] QRIS section — `/assets/qris.png`
- [ ] Online donation form / payment gateway integration

### Activities / Kegiatan (`/kegiatan`)
- [x] Page created (`pages/kegiatan/index.vue`)
- [x] Published activities fetched from Supabase (SSR via useAsyncData)
- [x] Category filter bar — Semua, Pengumuman, Kegiatan, Liturgi, Sosial
- [x] Upcoming section — card grid with category color bar, title, date/time/location
- [x] Past section — compact list with reduced opacity
- [x] Empty state when no activities published
- [x] Error state when DB unavailable
- [x] Added to AppNavbar + AppBottomNav

### Structure (`/struktur`)
- [x] Page created (`pages/struktur/index.vue`) — groups + members, avatar initials fallback, cached
- [x] `parish_groups` + `parish_members` tables with RLS + `member-photos` storage bucket
- [x] Added to AppNavbar

### Other public pages (not yet created)
- [ ] Reflections / Renungan listing + detail page
- [x] Ministries / Pelayanan listing page — `/pelayanan` index + `/pelayanan/[slug]` detail, live from Supabase `ministries` table, admin CRUD at `/admin/pelayanan`
- [ ] Contact / Kontak page
- [x] Sacrament info pages — `/sakramen` index + `/sakramen/[slug]` detail (Baptis, Ekaristi/Komuni Pertama, Krisma, Pernikahan, Pengakuan Dosa, Pengurapan Orang Sakit)

---

## Authentication

- [x] Login page (`/login`) — email + password form
- [x] `useAuth` composable — wraps Supabase `signIn` / `signOut`
- [x] `auth` middleware — redirects unauthenticated users away from `/admin`
- [x] Safe redirect after login (prevents open-redirect)
- [x] Generic error message (no account enumeration — OWASP A01)
- [x] Forgot password — `/lupa-sandi` page sends Supabase reset email
- [x] Reset password — `/reset-sandi` callback page handles token + new password form
- [x] Session refresh / token rotation handling — `plugins/auth-session.client.ts` subscribes to `onAuthStateChange`; handles TOKEN_REFRESHED, SIGNED_OUT (auto-redirect), USER_UPDATED

---

## Admin Dashboard (`/admin`)

### Layout
- [x] Custom sidebar layout (`layouts/dashboard.vue`) — no Nuxt UI Pro required
- [x] Sidebar navigation links (Dashboard, Jadwal Misa, Umat, Kegiatan, Laporan)

### Dashboard Overview (`/admin`)
- [x] Welcome banner with current liturgical season
- [x] Stats cards — registered members, active ministries, volunteers
- [x] Recent Activity feed (static/hardcoded)
- [x] Admin Tasks checklist with progress bar
- [x] Upcoming Events panel (static/hardcoded — Holy Week)
- [x] Quick Actions grid (Add Schedule, Register Member, Announcement, Download Report)

### Mass Schedule Management (`/admin/jadwal-misa`)
- [x] List all schedules grouped by day
- [x] Add new schedule (modal form)
- [x] Edit existing schedule (modal form)
- [x] Delete schedule (confirmation dialog)
- [x] Toggle active/inactive per schedule
- [x] Special event / one-off schedule management — via "Jadwal Khusus" tab

### Member Management (`/admin/umat`)
- [x] Page created (`pages/admin/umat/index.vue`)
- [x] Stats row — total, pending verification, verified members, clergy count
- [x] Member list with search (name, email, phone) + role filter
- [x] Quick verify button — promotes GUEST → MEMBER in one click
- [x] Edit member modal — name, phone, address, role assignment
- [x] Delete member (removes from `public.users`; auth account unaffected)
- [x] Admin RLS policies on `public.users` — admin_read_all_users, admin_update_any_user
- [ ] New member registration form (requires Edge Function + service_role key)
- [ ] Bulk actions (bulk verify, bulk export)

### Activities Management (`/admin/kegiatan`)
- [x] Page created (`pages/admin/kegiatan/index.vue`)
- [x] List all activities with search + category + status filters
- [x] Add new activity (modal form — title, category, date, time, location, description, published toggle)
- [x] Edit existing activity (modal form)
- [x] Delete activity (confirmation dialog)
- [x] Toggle published / draft status per activity
- [x] `activities` table in Supabase with RLS (public read published; admin CRUD via users.role)
- [x] Input sanitization + CHECK constraints (OWASP A03)
- [x] `created_by` audit trail enforced by RLS WITH CHECK (OWASP A04)
- [ ] Special event / recurring activity support

### Reports (`/admin/laporan`)
- [ ] Page not yet created
- [ ] Financial report viewer / download

---

## Infrastructure & Backend

- [x] Nuxt 3 + @nuxt/ui v3 setup
- [x] Custom `melania` color palette (primary #1a3b4c, secondary #735a3a)
- [x] Noto Serif + Manrope fonts
- [x] `useSupabase` composable
- [x] Supabase project connected — `users`, `daily_verses`, `mass_schedules` tables with RLS
- [x] Real data fetching for mass schedule
- [ ] Real data fetching for activities / events
- [ ] Real data fetching for reflections / articles
- [ ] Image storage (Supabase Storage or similar)
- [ ] CMS for content management (reflections, announcements)

---

## Design Source
Stitch project: **Melania Web app** (ID: `11402702406916777625`)
- Screens available: Admin Dashboard Overview (Desktop), Manage Mass Schedule, Manage Activities
