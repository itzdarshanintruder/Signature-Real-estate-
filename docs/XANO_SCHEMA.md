# Xano Schema Definition

> **SUPERSEDED** — the authoritative, up-to-date schema (incl. required/nullable, defaults, FKs, JSON fields, and UUID `id` configuration) lives in **[`XANO_IMPLEMENTATION.md`](./XANO_IMPLEMENTATION.md#2-exact-xano-schema--all-12-tables)**. This page is kept as a quick-reference snapshot.

> **Phase 7.1 — Step 1 (schema scaffolding).** Field-level definition for every Xano table, created to accept the CSVs in `backend/seed/csv/`. Use this document to create the columns in the Xano table builder before importing each CSV. Field names match the CSV headers exactly (import maps by header name, so column order in Xano is irrelevant).

---

## Xano notes before you start

1. **`id` is auto-created** — every new Xano table ships with an `id` (uuid, primary key). Keep it. It maps to the `id` column in each CSV so your deterministic UUIDs survive the import.
2. **Timestamps** — Xano auto-adds `created_at` / `updated_at` (timestamps). The CSVs carry the same values, so they map 1:1. If you delete them, Xano repopulates them automatically — either way works.
3. **No native `enum` type** — Xano has text, not enums. Create the enum-ish columns as **Text** and add a **validation rule** with the allowed values listed in each table below.
4. **Foreign keys** — create `project_id` as **uuid** on every child table, then optionally create a **one-to-many relationship** (`projects` → child). Creating the uuid field alone is sufficient for the CSV import.
5. **JSON columns** — use Xano's **JSON** type for the array/object columns. CSV cells contain valid JSON text, which Xano parses into the JSON field.

---

## Type reference (CSV column → Xano type)

| Xano type | Used for |
|---|---|
| `uuid` | `id`, `project_id` |
| `text` | Short strings, slugs, enums-as-text |
| `long text` | Multi-paragraph copy (`description`, `answer`, `quote`, …) |
| `integer` | Whole-rupee prices, `display_order`, `sort_order`, `version` |
| `decimal` | `value` (growth index) |
| `boolean` | `is_active`, `is_featured` |
| `timestamp` | `created_at`, `updated_at` |
| `json` | `plot_sizes`, `overview`, `features`, `amenities`, `investment_benefits`, `content` |

---

## 1. `projects`

Purpose: single source of truth for every phase/block. CSV: `projects.csv`.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key (auto-created) |
| `slug` | text | ✅ | Unique, kebab-case, immutable after publish |
| `title` | text | ✅ | e.g. "Signature City — Phase One" |
| `status` | text | ✅ | Enum as text: `available` / `premium` / `launching` / `sold-out` |
| `district` | text | ✅ | Filterable zone, e.g. "Growth Corridor" |
| `location` | text | ✅ | e.g. "Sector 12, Growth Corridor" |
| `plot_sizes` | json | ✅ | `string[]`, e.g. `["12×24","12×30"]` |
| `starting_price_inr` | integer | ✅ | Whole rupees; `null` = "Contact us" |
| `acreage` | text | ✅ | e.g. "4.2 Acres" |
| `tagline` | text | ✅ | |
| `description` | long text | ✅ | SEO/meta blurb |
| `short_description` | long text | ✅ | Card copy on listings |
| `overview` | json | ✅ | `string[]` paragraphs |
| `features` | json | ✅ | `string[]` highlight bullets |
| `amenities` | json | ✅ | `string[]` (project-detail page) |
| `investment_benefits` | json | ✅ | `string[]` |
| `is_featured` | boolean | ✅ | Featured on Home |
| `display_order` | integer | ✅ | Manual listing order |
| `map_url` | text | ✅ | HTTPS URL or null |
| `is_active` | boolean | ✅ | Soft delete |
| `created_at` | timestamp | ✅ | Auto |
| `updated_at` | timestamp | ✅ | Auto |

## 2. `project_images`

Purpose: hero / gallery / master-plan imagery per project. CSV: `project_images.csv`.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key |
| `project_id` | uuid | ✅ | FK → `projects` |
| `role` | text | ✅ | Enum as text: `hero` / `gallery` / `master_plan` |
| `sort_order` | integer | ✅ | Order within role |
| `src` | text | ✅ | Cloudinary URL or null |
| `alt` | text | ✅ | Meaningful alt; `""` = decorative |
| `caption` | text | ✅ | Optional, or null |
| `is_active` | boolean | ✅ | |

## 3. `available_plots`

Purpose: individually sellable plots. CSV: `available_plots.csv`.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key |
| `project_id` | uuid | ✅ | FK → `projects` |
| `size` | text | ✅ | e.g. "12×24" |
| `dimensions` | text | ✅ | e.g. "2880 sq. ft." |
| `facing` | text | ✅ | e.g. "East", "Corner" |
| `price_inr` | integer | ✅ | Whole rupees |
| `status` | text | ✅ | Enum as text: `available` / `reserved` / `sold` |
| `display_order` | integer | ✅ | |
| `is_active` | boolean | ✅ | |

## 4. `project_pricing`

Purpose: per-size price points. CSV: `project_pricing.csv`.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key |
| `project_id` | uuid | ✅ | FK → `projects` |
| `size` | text | ✅ | e.g. "12×24" |
| `dimensions` | text | ✅ | e.g. "2880 sq. ft." |
| `start_price_inr` | integer | ✅ | Whole rupees |
| `note` | text | ✅ | Optional, or null |
| `display_order` | integer | ✅ | |
| `is_active` | boolean | ✅ | |

## 5. `project_milestones`

Purpose: build/approval timeline. CSV: `project_milestones.csv`.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key |
| `project_id` | uuid | ✅ | FK → `projects` |
| `phase` | text | ✅ | Enum as text: `Completed` / `In progress` / `Upcoming` / `Ongoing` |
| `title` | text | ✅ | |
| `description` | long text | ✅ | |
| `display_order` | integer | ✅ | |
| `is_active` | boolean | ✅ | |

## 6. `nearby_places`

Purpose: points of interest around a project. CSV: `nearby_places.csv`.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key |
| `project_id` | uuid | ✅ | FK → `projects` |
| `name` | text | ✅ | |
| `category` | text | ✅ | Enum as text: `School` / `Hospital` / `Shopping` / `Connectivity` / `Transit` / `Recreation` |
| `distance` | text | ✅ | e.g. "2.4 km" |
| `display_order` | integer | ✅ | |
| `is_active` | boolean | ✅ | |

## 7. `faqs`

Purpose: site-wide + per-project FAQ. CSV: `faqs.csv`. `project_id = null` rows are site-wide.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key |
| `project_id` | uuid | ✅ | FK → `projects`; null = site-wide |
| `question` | text | ✅ | |
| `answer` | long text | ✅ | |
| `display_order` | integer | ✅ | |
| `is_active` | boolean | ✅ | |

## 8. `growth_series`

Purpose: annual land-value index. CSV: `growth_series.csv`. `project_id = null` is the site-wide series.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key |
| `project_id` | uuid | ✅ | FK → `projects`; null = site-wide |
| `year` | text | ✅ | e.g. "2018" |
| `value` | decimal | ✅ | Relative index, 100 = baseline |
| `display_order` | integer | ✅ | |
| `is_active` | boolean | ✅ | |

## 9. `gallery_items`

Purpose: public photo gallery. CSV: `gallery_items.csv`.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key |
| `category` | text | ✅ | Enum as text: `Master Plan` / `Lifestyle` / `Progress` / `Approvals` |
| `src` | text | ✅ | Cloudinary URL or null |
| `alt` | text | ✅ | Meaningful alt; `""` = decorative |
| `caption` | text | ✅ | Optional, or null |
| `display_order` | integer | ✅ | |
| `is_active` | boolean | ✅ | |

## 10. `site_content`

Purpose: atomic marketing copy blocks (CMS). CSV: `site_content.csv`.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key |
| `key` | text | ✅ | Unique. Allowlist: `hero`, `hero_card`, `trust_bar`, `stats`, `location`, `premium_plots`, `investment`, `investment_growth_ref`, `why_choose`, `about`, `journey`, `amenity_pillars` |
| `version` | integer | ✅ | Optimistic concurrency; default 1 |
| `is_active` | boolean | ✅ | |
| `content` | json | ✅ | Typed JSON block matching the frontend section shape |

## 11. `amenities`

Purpose: site-level amenity cards. CSV: `amenities.csv`.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key |
| `title` | text | ✅ | e.g. "24×7 Security" |
| `description` | text | ✅ | |
| `icon` | text | ✅ | Lucide icon key, e.g. `shield`, `trees` |
| `display_order` | integer | ✅ | |
| `is_active` | boolean | ✅ | |

## 12. `testimonials`

Purpose: social proof on Home. CSV: `testimonials.csv`.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✅ | Primary key |
| `quote` | long text | ✅ | |
| `name` | text | ✅ | |
| `role` | text | ✅ | |
| `display_order` | integer | ✅ | |
| `is_active` | boolean | ✅ | |

---

## Recommended creation order

The same order as the CSV import (parents before children, since relationships reference `projects`):

1. `projects`
2. `project_images`
3. `available_plots`
4. `project_pricing`
5. `project_milestones`
6. `nearby_places`
7. `faqs`
8. `growth_series`
9. `gallery_items`
10. `site_content`
11. `amenities`
12. `testimonials`

## Per-table creation steps (repeat for each table)

1. Create the table (name matches the CSV filename, e.g. `projects`).
2. Keep the auto-created `id` (uuid) and `created_at` / `updated_at` (timestamps).
3. Add each column from the table's section above with the exact field name and Xano type.
4. For enum-as-text fields, add a validation rule restricting the allowed values listed in the notes.
5. Import the matching CSV from `backend/seed/csv/` — header names map to the fields automatically.
