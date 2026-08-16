/**
 * Seed JSON -> CSV converter (Xano CSV import).
 * Preserves every id and relationship. JSON-typed columns are serialized
 * into a single quoted cell as valid JSON text.
 *
 * Usage: node backend/scripts/seed-to-csv.mjs
 * Output: backend/seed/csv/<table>.csv  (import order preserved)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const seedDir = path.join(root, 'seed')
const outDir = path.join(seedDir, 'csv')

const ORDER = [
  'projects',
  'project_images',
  'available_plots',
  'project_pricing',
  'project_milestones',
  'nearby_places',
  'faqs',
  'growth_series',
  'gallery_items',
  'site_content',
  'amenities',
  'testimonials',
]

function escapeCell(value) {
  if (value === null || value === undefined) return ''
  const s = typeof value === 'string' ? value : JSON.stringify(value)
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function toCsv(rows) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCell(row[h])).join(','))
  }
  return `${lines.join('\r\n')}\r\n`
}

fs.mkdirSync(outDir, { recursive: true })

for (const name of ORDER) {
  const file = path.join(seedDir, `${name}.json`)
  const rows = JSON.parse(fs.readFileSync(file, 'utf8'))
  fs.writeFileSync(path.join(outDir, `${name}.csv`), toCsv(rows), 'utf8')
  console.log(`${name}.csv  ${rows.length} rows`)
}
