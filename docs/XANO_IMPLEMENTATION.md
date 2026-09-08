# Xano Implementation Guide

> **Phase 7.1 — Steps 1–6.** Executes the approved [Backend Blueprint](./BACKEND_BLUEPRINT.md).
> Seed data: `backend/seed/*.json` (canonical) + `backend/seed/csv/*.csv` (import files, same IDs/relationships).
> Authoritative schema doc: this file (per-table specs in §2).

---

## Table of contents

1. [Critical: how the `id` (UUID) field must be configured](#1-critical-how-the-id-uuid-field-must-be-configured)
2. [Exact Xano schema — all 12 tables](#2-exact-xano-schema--all-12-tables)
3. [Runbook — Phase A: schema setup](#3-runbook--phase-a-schema-setup)
4. [Runbook — Phase B: CSV import](#4-runbook--phase-b-csv-import)
5. [Runbook — Phase C: API endpoint setup](#5-runbook--phase-c-api-endpoint-setup)
6. [Runbook — Phase D: frontend connection](#6-runbook--phase-d-frontend-connection)
7. [Verification & troubleshooting](#7-verification--troubleshooting)

---

## 1. Critical: how the `id` (UUID) field must be configured

The seed data uses **deterministic UUID v4 ids** (e.g. `10000000-0000-4000-8000-000000000001`). Child tables reference parents through these exact UUIDs (`project_id`), so the UUIDs **must survive the import** — nothing may be re-generated.

### Why your pre-created tables are the correct setup

Xano's CSV importer **only supports integer primary keys when a NEW table is created from a CSV** (it cannot designate a UUID column as PK during new-table import). Because you already created the 12 tables manually, each table ships with Xano's default `id` field, which is **type UUID and marked primary key** — exactly what we need. Do not recreate tables from CSV.

### Required `id` field configuration (every table)

1. **Type = UUID** — never `Auto Increment` or integer. Xano's default `id` on a manually created table is already UUID; leave it.
2. **Primary key = on** (Xano sets this automatically for `id`).
3. **Do NOT set it to auto-generate a "Sequential ID".** Xano auto-generates a UUID only when a row is created *without* a supplied id. Our CSVs supply the id, so the importer's upsert-by-primary-key path inserts rows **using the CSV's UUIDs**.
4. **During CSV import, keep the `id` column mapped** to the table's `id` field. Do not hide/exclude the `id` column in the import preview — hiding it is the only way Xano would mint brand-new UUIDs and break every `project_id` link.
5. **Import into the existing (empty) table** using "Import Data → CSV" from inside the table. When the CSV has a column mapped to the primary key, Xano upserts: rows whose id already exists are updated, rows that don't exist are inserted **with the provided id**.

### How to verify the UUIDs survived (do this on every table)

After import, confirm the first row of `projects` has `id = 10000000-0000-4000-8000-000000000001` and child tables reference only ids that exist in `projects`. Exact commands are in [§7 Verification & troubleshooting](#7-verification--troubleshooting). If — and only if — your workspace ever mints new ids instead, the recovery procedure (reference rebuild via the `slug` natural key) is also documented in §7.

---

## 2. Exact Xano schema — all 12 tables

Legend:
- **PK** = primary key. **FK→projects** = the `project_id` plain-UUID field pointing at `projects`.
- **Req** = Xano "required" toggle. **Default** = set in the field editor where noted.
- **Enum as text** = create as `text` + add a validation rule with the listed values (Xano has no native enum type).
- **JSON** = Xano field type `json`; CSV cells hold valid JSON text that Xano parses into the field.
- `id`, `created_at`, `updated_at` are common to **every** table (see each table's header row).

### 2.1 `projects` — CSV: `projects.csv` (22 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `slug` | text | yes | no | – | | – |
| `title` | text | yes | no | – | | – |
| `status` | text | yes | no | `available` | | – (enum: `available` `premium` `launching` `sold-out`) |
| `district` | text | yes | no | – | | – |
| `location` | text | yes | no | – | | – |
| `plot_sizes` | json | yes | no | `[]` | | ✅ `string[]` |
| `starting_price_inr` | integer | no | **yes** | `null` (="Contact us") | | – |
| `acreage` | text | yes | no | – | | – |
| `tagline` | text | yes | no | – | | – |
| `description` | long text | yes | no | – | | – |
| `short_description` | long text | yes | no | – | | – |
| `overview` | json | yes | no | `[]` | | ✅ `string[]` |
| `features` | json | yes | no | `[]` | | ✅ `string[]` |
| `amenities` | json | yes | no | `[]` | | ✅ `string[]` (project-detail page) |
| `investment_benefits` | json | yes | no | `[]` | | ✅ `string[]` |
| `is_featured` | boolean | yes | no | `false` | | – |
| `display_order` | integer | yes | no | `0` | | – |
| `map_url` | text | no | **yes** | `null` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `created_at` | timestamp | auto | no | now | | – |
| `updated_at` | timestamp | auto | no | now | | – |

### 2.2 `project_images` — CSV: `project_images.csv` (8 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `project_id` | uuid | yes | no | – | **FK→projects** | – |
| `role` | text | yes | no | `gallery` | | – (enum: `hero` `gallery` `master_plan`) |
| `sort_order` | integer | yes | no | `0` | | – |
| `src` | text | no | **yes** | `null` (renders placeholder) | | – |
| `alt` | text | yes | no | – | | – |
| `caption` | text | no | **yes** | `null` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `created_at` / `updated_at` | timestamp | auto | no | now | | – |

### 2.3 `available_plots` — CSV: `available_plots.csv` (9 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `project_id` | uuid | yes | no | – | **FK→projects** | – |
| `size` | text | yes | no | – | | – (e.g. `12×24`) |
| `dimensions` | text | yes | no | – | | – (e.g. `2880 sq. ft.`) |
| `facing` | text | yes | no | – | | – (e.g. `East`, `Corner`) |
| `price_inr` | integer | yes | no | – | | – |
| `status` | text | yes | no | `available` | | – (enum: `available` `reserved` `sold`) |
| `display_order` | integer | yes | no | `0` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `created_at` / `updated_at` | timestamp | auto | no | now | | – |

### 2.4 `project_pricing` — CSV: `project_pricing.csv` (8 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `project_id` | uuid | yes | no | – | **FK→projects** | – |
| `size` | text | yes | no | – | | – |
| `dimensions` | text | yes | no | – | | – |
| `start_price_inr` | integer | yes | no | – | | – |
| `note` | text | no | **yes** | `null` | | – |
| `display_order` | integer | yes | no | `0` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `created_at` / `updated_at` | timestamp | auto | no | now | | – |

### 2.5 `project_milestones` — CSV: `project_milestones.csv` (7 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `project_id` | uuid | yes | no | – | **FK→projects** | – |
| `phase` | text | yes | no | `Upcoming` | | – (enum: `Completed` `In progress` `Upcoming` `Ongoing`) |
| `title` | text | yes | no | – | | – |
| `description` | long text | yes | no | – | | – |
| `display_order` | integer | yes | no | `0` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `created_at` / `updated_at` | timestamp | auto | no | now | | – |

### 2.6 `nearby_places` — CSV: `nearby_places.csv` (7 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `project_id` | uuid | yes | no | – | **FK→projects** | – |
| `name` | text | yes | no | – | | – |
| `category` | text | yes | no | – | | – (enum: `School` `Hospital` `Shopping` `Connectivity` `Transit` `Recreation`) |
| `distance` | text | yes | no | – | | – (e.g. `2.4 km`) |
| `display_order` | integer | yes | no | `0` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `created_at` / `updated_at` | timestamp | auto | no | now | | – |

### 2.7 `faqs` — CSV: `faqs.csv` (6 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `project_id` | uuid | no | **yes** | `null` (= site-wide FAQ) | **FK→projects** (optional) | – |
| `question` | text | yes | no | – | | – |
| `answer` | long text | yes | no | – | | – |
| `display_order` | integer | yes | no | `0` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `created_at` / `updated_at` | timestamp | auto | no | now | | – |

### 2.8 `growth_series` — CSV: `growth_series.csv` (6 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `project_id` | uuid | no | **yes** | `null` (= site-wide series) | **FK→projects** (optional) | – |
| `year` | text | yes | no | – | | – (e.g. `2018`) |
| `value` | decimal | yes | no | – | | – (relative index, 100 = baseline) |
| `display_order` | integer | yes | no | `0` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `created_at` / `updated_at` | timestamp | auto | no | now | | – |

### 2.9 `gallery_items` — CSV: `gallery_items.csv` (7 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `category` | text | yes | no | `Lifestyle` | | – (enum: `Master Plan` `Lifestyle` `Progress` `Approvals`) |
| `src` | text | no | **yes** | `null` (renders placeholder) | | – |
| `alt` | text | yes | no | – | | – |
| `caption` | text | no | **yes** | `null` | | – |
| `display_order` | integer | yes | no | `0` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `created_at` / `updated_at` | timestamp | auto | no | now | | – |

### 2.10 `site_content` — CSV: `site_content.csv` (5 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `key` | text | yes | no | – | | – (unique. Allowlist: `hero` `hero_card` `trust_bar` `stats` `location` `premium_plots` `investment` `investment_growth_ref` `why_choose` `about` `journey` `amenity_pillars`) |
| `version` | integer | yes | no | `1` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `content` | json | yes | no | – | | ✅ typed block matching the frontend section shape |
| `created_at` / `updated_at` | timestamp | auto | no | now | | – |

### 2.11 `amenities` — CSV: `amenities.csv` (6 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `title` | text | yes | no | – | | – |
| `description` | text | yes | no | – | | – |
| `icon` | text | yes | no | – | | – (lucide icon key, e.g. `shield`) |
| `display_order` | integer | yes | no | `0` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `created_at` / `updated_at` | timestamp | auto | no | now | | – |

### 2.12 `testimonials` — CSV: `testimonials.csv` (6 cols)

| Field | Xano type | Req | Nullable | Default | FK | JSON |
|---|---|---|---|---|---|---|
| `id` | uuid | auto | no | auto-gen (CSV provides) | PK | – |
| `quote` | long text | yes | no | – | | – |
| `name` | text | yes | no | – | | – |
| `role` | text | yes | no | – | | – |
| `display_order` | integer | yes | no | `0` | | – |
| `is_active` | boolean | yes | no | `true` | | – |
| `created_at` / `updated_at` | timestamp | auto | no | now | | – |

### Schema amendments vs. the approved blueprint

- **T1 `projects.amenities` (json)** — added column to serve `Project.amenities` (not in the original blueprint table spec). Required by the frozen frontend contract.
- **T10 `site_content` keys** — include `hero_card` and `investment_growth_ref` in the allowlist (both already exist in the static layer).
- Everything else matches `BACKEND_BLUEPRINT.md` §3 exactly.

---

## 3. Runbook — Phase A: schema setup

Order matters only because children reference `projects` (and `faqs`/`growth_series` may optionally reference it). Work down the list:

1. `projects` → 2. `project_images` → 3. `available_plots` → 4. `project_pricing` → 5. `project_milestones` → 6. `nearby_places` → 7. `faqs` → 8. `growth_series` → 9. `gallery_items` → 10. `site_content` → 11. `amenities` → 12. `testimonials`

Per table:

1. Confirm `id` exists as **uuid / primary key** (§1). Confirm `created_at` exists.
2. **Add `updated_at`** as `timestamp` (the CSVs carry it; without it the import will reject that column).
3. Add every other column from §2 with the exact field name, type, required toggle, and default shown.
4. For enum-as-text fields, add a **validation rule** listing the allowed values from §2 (this also gives Xano the enum dropdown-like behaviour).
5. `project_id`: create as a **plain `uuid`** field (matching the CSV header). Optionally also add a **table reference** field afterwards if you want Xano's relationship navigation in the admin, but keep `project_id` itself as uuid — the API DTO mapper expects a uuid, not an embedded object.

---

## 4. Runbook — Phase B: CSV import

Import files: `backend/seed/csv/*.csv`. Import **in the same order as schema setup** (parents first).

For each table:

1. Open the table → **Import Data → CSV**.
2. Upload `backend/seed/csv/<table>.csv`.
3. In the column-mapping preview, check every column maps to the matching field. **Critical: keep the `id` column mapped to the `id` field** (do not hide it) — this preserves the deterministic UUIDs (§1). `created_at` / `updated_at` map to the timestamp fields.
4. Confirm the field types match the CSV preview (text/json/integer/boolean per §2), then run the import.
5. **Verify** (§7) before moving to the next table.
BASE_URL
---

## 5. Runbook — Phase C: API endpoint setup

Create these in the Xano API builder. **All public responses must be wrapped `{ "data": … }`** to match `apiFetch`/`unwrap` in `src/services/api-client.ts`. Field names in responses are the **camelCase DTOs** (§6 mapping in the blueprint) — the frontend mapper is Phase D; the endpoint should return the DTO shape below directly.

### C1. `GET /projects` → `{ data: Project[] }`

- Filter by `status`, `district`, `price` (budget bucket), `search` (title / short_description), `featured`.
- Sort by `featured`, `price_asc`, `price_desc`, `name`.
- Eager-load children: images (grouped by role), available plots, pricing rows, milestones, nearby places, project FAQs, growth override.
- Exclude `is_active = false`. Default order `(display_order, status)`.

```jsonc
{ "data": [ {
  "id": "10000000-0000-4000-8000-000000000001",
  "slug": "signature-city-phase-one", "title": "Signature City — Phase One",
  "location": "Sector 12, Growth Corridor", "district": "Growth Corridor",
  "status": "available", "plotSizes": ["12×24","12×30","15×30"],
  "startingPriceInr": 900000, "acreage": "4.2 Acres", "tagline": "…",
  "description": "…", "shortDescription": "…",
  "overview": ["…"], "features": ["…"], "amenities": ["…"], "investmentBenefits": ["…"],
  "images": [{ "src": null, "alt": "…", "caption": "…" }],
  "gallery": [{ "src": null, "alt": "…", "caption": "…" }],
  "masterPlan": { "src": null, "alt": "…", "caption": "…" },
  "availablePlots": [{ "id": "…", "size": "12×24", "dimensions": "…", "facing": "East", "priceInr": 900000, "status": "available" }],
  "pricing": [{ "size": "…", "dimensions": "…", "startPriceInr": 900000, "note": null }],
  "milestones": [{ "phase": "Completed", "title": "…", "description": "…" }],
  "nearbyPlaces": [{ "name": "…", "category": "School", "distance": "2.1 km" }],
  "faq": [{ "question": "…", "answer": "…" }],
  "isFeatured": true } ] }
```

### C2. `GET /projects/:slug` → `{ data: Project | null }`

Lookup by `slug` where `is_active = true`; load full DTO. Not found → **200** `{ "data": null }` (frontend treats null as not-found).

### C3. `GET /gallery` → `{ data: GalleryItem[] }`

Active items ordered by `display_order`: `{ "id", "category", "image": { "src", "alt", "caption" } }`.

### C4. `GET /site_content` → `{ data: SiteContent }`

Assemble from `site_content` rows + normalized lists: `amenities` ← T11, `testimonials` ← T12, `faqItems` ← `faqs` (`project_id IS NULL`), growth series ← T8 site-wide. Returns camelCase keys: `heroContent`, `trustBar`, `stats`, `locationHighlights`, `premiumPlots`, `investment`, `amenities`, `testimonials`, `faqItems`, `about`, `journey` (+ `investmentGrowth` once the frontend plumb is added, Phase D).

### C5. `GET /faq` → `{ data: FaqItem[] }`

`faqs` where `project_id IS NULL`, active, by `display_order`.

### C6. `POST /leads` → `{ data: { id } }` (Step 3)

Slug → `project_id` lookup; **honeypot** (if `company` non-empty, drop + return 200); phone normalization to E.164; `consent` must be `true` else 400; rate limit 5/10 min per `ip_hash`; server-side `source` from headers (never trust client).

---

## 6. Runbook — Phase D: frontend connection

> **Not executed yet — this phase only documents what will happen.** The frontend is untouched for now.

1. Set `VITE_API_URL` (staging Xano API base URL) in the build env. `IS_API_ENABLED` in `src/config/env.ts` flips the services to HTTP automatically.
2. Add **DTO mappers** in `src/services/*` (`mapProject`, `mapGalleryItem`, `mapSiteContent`) to convert snake_case rows → the typed frontend contracts. This is the designated integration point (§14.2 / D3 of the foundation doc).
3. Route the growth index through `SiteContent` (add `investmentGrowth: GrowthDatum[]`) so `Investment.tsx` stops importing from `src/data/site-content.ts`.
4. **Exit gate:** `npm run test:e2e` viewport matrix green against Xano staging data.
5. Continue blueprint §7: Step 4 auth + RBAC, Step 5 admin CRUD, Step 6 hardening.

---

## 7. Verification & troubleshooting

### 7.1 Verify every import preserved UUIDs

Check counts and that child `project_id`s resolve (run after each import, or all at the end):

| Table | Expected rows |
|---|---|
| projects | 6 |
| project_images | 35 |
| available_plots | 21 |
| project_pricing | 12 |
| project_milestones | 19 |
| nearby_places | 30 |
| faqs | 24 |
| growth_series | 9 |
| gallery_items | 9 |
| site_content | 12 |
| amenities | 10 |
| testimonials | 3 |

- `projects` first row id must equal `10000000-0000-4000-8000-000000000001`.
- Every `project_id` value in child tables must exist in `projects.id`. (Locally you can re-run the checks in `backend/seed/` — the CSVs were validated: 0 orphan FKs, all ids unique.)
- If a table's row count is off, clear the table and re-import; do **not** import the same CSV twice (upsert would overwrite rows with identical ids — harmless, but keeps counts honest).

### 7.2 Recovery — if your workspace minted new UUIDs instead

If (and only if) import showed Xano generated new ids, rebuild references with a one-off Xano function using the **natural key**:

1. Query all `projects`; store map `slug → projects.id`.
2. For each child row that has a `project_slug`-like natural key, `Edit Record` setting `project_id` to the matched parent id. For this dataset, match children to parents by importing the slug alongside (`projects.slug` is the reliable join; the seed CSVs are ordered so you can join by display position too).

This is only a fallback; with the §1 configuration the primary path preserves ids directly.

### 7.3 Common import errors

| Symptom | Cause / fix |
|---|---|
| "CSV columns must already exist" | A CSV header has no matching field. Add the field per §2 (exact name + type), especially `updated_at`. |
| JSON column rejected | Field created as `text`, not `json`. Recreate as `json`. |
| Boolean/integer look wrong | Field type in table doesn't match §2; fix type before import. |
| Ids differ from CSV after import | `id` column was hidden or the field is `auto increment`. Re-import with `id` mapped to the UUID PK (§1). |
