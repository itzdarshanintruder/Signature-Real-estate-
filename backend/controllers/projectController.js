const crypto = require('node:crypto')
const Project = require('../models/Project')
const ProjectImage = require('../models/ProjectImage')
const AvailablePlot = require('../models/AvailablePlot')
const ProjectPricing = require('../models/ProjectPricing')
const ProjectMilestone = require('../models/ProjectMilestone')
const NearbyPlace = require('../models/NearbyPlace')
const Faq = require('../models/Faq')
const GrowthDatum = require('../models/GrowthDatum')

// ─── DTO mapping (snake_case wire contract used by both public + admin) ──────

function projectCore(doc) {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    status: doc.status,
    district: doc.district,
    location: doc.location,
    plot_sizes: doc.plot_sizes || [],
    starting_price_inr: doc.starting_price_inr ?? null,
    acreage: doc.acreage,
    tagline: doc.tagline || '',
    description: doc.description || '',
    short_description: doc.short_description || '',
    overview: doc.overview || [],
    features: doc.features || [],
    amenities: doc.amenities || [],
    investment_benefits: doc.investment_benefits || [],
    is_featured: doc.is_featured,
    display_order: doc.display_order,
    is_active: doc.is_active,
    map_url: doc.map_url ?? null,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  }
}

const byProjectId = (rows) => {
  const map = new Map()
  for (const row of rows) {
    if (!map.has(row.project_id)) map.set(row.project_id, [])
    map.get(row.project_id).push(row)
  }
  return map
}

function imageDto(row) {
  return { src: row.src ?? null, alt: row.alt || '', caption: row.caption ?? null }
}

function assembleChildren(projectId, ctx) {
  const images = (ctx.images.get(projectId) || []).sort((a, b) => a.sort_order - b.sort_order)

  return {
    images: images.filter((i) => i.role === 'hero').map(imageDto),
    gallery: images.filter((i) => i.role === 'gallery').map(imageDto),
    master_plan: (images.find((i) => i.role === 'master_plan') || null)
      ? imageDto(images.find((i) => i.role === 'master_plan'))
      : null,
    available_plots: (ctx.plots.get(projectId) || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((p) => ({
        id: p.id,
        size: p.size,
        dimensions: p.dimensions,
        facing: p.facing,
        price_inr: p.price_inr,
        status: p.status,
      })),
    pricing: (ctx.pricing.get(projectId) || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((p) => ({
        size: p.size,
        dimensions: p.dimensions,
        start_price_inr: p.start_price_inr,
        note: p.note ?? null,
      })),
    milestones: (ctx.milestones.get(projectId) || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((m) => ({ phase: m.phase, title: m.title, description: m.description })),
    nearby_places: (ctx.nearby.get(projectId) || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((n) => ({ name: n.name, category: n.category, distance: n.distance })),
    faq: (ctx.faqs.get(projectId) || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((f) => ({ question: f.question, answer: f.answer })),
    investment_growth: (ctx.growth.get(projectId) || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((g) => ({ year: g.year, value: g.value })),
  }
}

/** Preconditions only if the request's children query is empty (project has no children yet). */
async function loadChildContext() {
  const [images, plots, pricing, milestones, nearby, faqs, growth] = await Promise.all([
    ProjectImage.find({ is_active: true }).lean(),
    AvailablePlot.find({ is_active: true }).lean(),
    ProjectPricing.find({ is_active: true }).lean(),
    ProjectMilestone.find({ is_active: true }).lean(),
    NearbyPlace.find({ is_active: true }).lean(),
    Faq.find({ is_active: true }).lean(),
    GrowthDatum.find({ is_active: true }).lean(),
  ])
  return {
    images: byProjectId(images),
    plots: byProjectId(plots),
    pricing: byProjectId(pricing),
    milestones: byProjectId(milestones),
    nearby: byProjectId(nearby),
    faqs: byProjectId(faqs),
    growth: byProjectId(growth),
  }
}

function toFullProjectDto(doc, ctx) {
  return { ...projectCore(doc), ...assembleChildren(doc.id, ctx) }
}

// ─── Controllers ──────────────────────────────────────────────────────────────

/** GET /projects — returns every project (active + inactive) for admin; the
 *  public service filters is_active client-side. Children eager-loaded. */
async function list(req, res, next) {
  try {
    const [projects, ctx] = await Promise.all([Project.find({}).sort({ display_order: 1, createdAt: 1 }).lean(), loadChildContext()])
    return res.json({ data: projects.map((p) => toFullProjectDto(p, ctx)) })
  } catch (err) {
    return next(err)
  }
}

/** GET /projects/:slug (public) or /projects/:id (admin). */
async function getOne(req, res, next) {
  try {
    const param = req.params.p
    const doc = await Project.findOne({ $or: [{ slug: param }, { id: param }] }).lean()
    if (!doc) return res.json({ data: null })
    const ctx = await loadChildContext()
    return res.json({ data: toFullProjectDto(doc, ctx) })
  } catch (err) {
    return next(err)
  }
}

function pickProjectFields(body) {
  const fields = [
    'slug', 'title', 'status', 'district', 'location', 'plot_sizes',
    'starting_price_inr', 'acreage', 'tagline', 'description',
    'short_description', 'overview', 'features', 'amenities',
    'investment_benefits', 'is_featured', 'display_order', 'is_active', 'map_url',
  ]
  const out = {}
  for (const f of fields) if (body[f] !== undefined) out[f] = body[f]
  return out
}

async function create(req, res, next) {
  try {
    const data = pickProjectFields(req.body || {})
    if (!data.slug || !data.title) {
      return res.status(400).json({ message: 'slug and title are required.', code: 'VALIDATION_ERROR' })
    }
    data.slug = String(data.slug).toLowerCase().trim().replace(/\s+/g, '-')
    data.id = crypto.randomUUID()
    const project = await Project.create(data)
    const ctx = await loadChildContext()
    return res.status(201).json({ data: toFullProjectDto(project.toObject(), ctx) })
  } catch (err) {
    return next(err)
  }
}

async function update(req, res, next) {
  try {
    const data = pickProjectFields(req.body || {})
    if (data.slug) data.slug = String(data.slug).toLowerCase().trim().replace(/\s+/g, '-')
    const doc = await Project.findOneAndUpdate(
      { $or: [{ slug: req.params.p }, { id: req.params.p }] },
      { $set: data },
      { new: true },
    ).lean()
    if (!doc) return res.status(404).json({ message: 'Project not found.', code: 'NOT_FOUND' })
    const ctx = await loadChildContext()
    return res.json({ data: toFullProjectDto(doc, ctx) })
  } catch (err) {
    return next(err)
  }
}

async function remove(req, res, next) {
  try {
    const doc = await Project.findOneAndDelete({ $or: [{ slug: req.params.p }, { id: req.params.p }] })
    if (!doc) return res.status(404).json({ message: 'Project not found.', code: 'NOT_FOUND' })
    return res.json({ data: null })
  } catch (err) {
    return next(err)
  }
}

module.exports = { list, getOne, create, update, remove }