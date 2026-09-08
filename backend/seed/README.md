# Xano Seed Data

Phase 7.1 — Step 1 (schema scaffolding) assets. Generated 1:1 from the approved Phase 4 static layer (`src/data/*`).

## Formats

- `*.json` — canonical source of truth.
- `csv/*.csv` — CSV variants for Xano workspaces that only support CSV import (same rows, same IDs, same relationships). JSON-typed columns (`plot_sizes`, `overview`, `features`, `amenities`, `investment_benefits`, `content`) are serialized into a single quoted cell as valid JSON text.

Regenerate the CSVs after editing a JSON file:

```
node backend/scripts/seed-to-csv.mjs
```

## Import order

Import in this order (parent tables first so FKs resolve). Files in `csv/` carry the same names:

1. `projects` (T1)
2. `project_images.json` (T2)
3. `available_plots.json` (T3)
4. `project_pricing.json` (T4)
5. `project_milestones.json` (T5)
6. `nearby_places.json` (T6)
7. `faqs.json` (T7)
8. `growth_series.json` (T8)
9. `gallery_items.json` (T9)
10. `site_content.json` (T10)
11. `amenities.json` (T11)
12. `testimonials.json` (T12)

## ID convention

Deterministic, valid UUID v4-format ids. The first hex group identifies the table; the last group is a stable running number.

| Prefix | Table |
|---|---|
| `1…` | projects |
| `2…` | project_images |
| `3…` | available_plots |
| `4…` | project_pricing |
| `5…` | project_milestones |
| `6…` | nearby_places |
| `7…` | faqs |
| `8…` | growth_series |
| `9…` | gallery_items |
| `a…` | site_content |
| `b…` | amenities |
| `c…` | testimonials |

## Notes

- `src`/`map_url` are `null` → the frontend renders the branded placeholder. Replace with Cloudinary URLs (`VITE_CLOUDINARY_CLOUD_NAME`) before going live.
- `faqs.json`: rows with `project_id: null` are site-wide; rows with a project id belong to that project's detail page.
- `growth_series.json`: `project_id: null` is the site-wide series (the `investment_growth_ref` row in `site_content.json` points at it).
- `projects.amenities` is an added JSON column on T1 (not in the original blueprint) required to serve `Project.amenities`; see the implementation guide.
