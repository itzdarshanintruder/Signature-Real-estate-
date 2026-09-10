import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MongoClient, ObjectId } from 'mongodb'

const PORT = process.env.PORT || 3001
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const DB_NAME = process.env.DB_NAME || 'realestate'

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://localhost:5175')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const client = new MongoClient(MONGO_URL, {
  serverSelectionTimeoutMS: 5000,
})

let db
let projects
let leads
let omegaPlots
let projectPlots

try {
  console.log('Connecting to MongoDB...')
  await client.connect()
  db = client.db(DB_NAME)
  projects = db.collection('projects')
  leads = db.collection('leads')
  omegaPlots = db.collection('omega_plots')
  projectPlots = db.collection('project_plots')
  console.log(`MongoDB connected: ${DB_NAME}`)
} catch (error) {
  console.error('MongoDB connection error:', error.message)
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
  })

  res.end(JSON.stringify(data))
}

function getProjectId(req) {
  const match = req.url.match(/^\/projects\/([^/]+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })

    req.on('error', reject)
  })
}

// --------------------------------------------------
// Seed projects from backend/seed/projects.json
// Only when MongoDB projects collection is empty
// --------------------------------------------------

if (projects) {
  try {
    const projectCount = await projects.countDocuments()

    if (projectCount === 0) {
      const currentDir = path.dirname(fileURLToPath(import.meta.url))

      const seedFile = path.join(
        currentDir,
        '..',
        'backend',
        'seed',
        'projects.json',
      )

      if (fs.existsSync(seedFile)) {
        const seedProjects = JSON.parse(
          fs.readFileSync(seedFile, 'utf8'),
        )

        if (Array.isArray(seedProjects) && seedProjects.length > 0) {
          await projects.insertMany(seedProjects)

          console.log(
            `Seeded ${seedProjects.length} projects into MongoDB`,
          )
        }
      }
    }

    console.log(
      'MongoDB projects:',
      await projects.countDocuments(),
    )
  } catch (error) {
    console.error('Project seed or count error:', error)
  }
} else {
  console.log('Skipping project seed because MongoDB is not connected.')
}

// --------------------------------------------------
// HTTP SERVER
// --------------------------------------------------

const server = http.createServer(async (req, res) => {
  // ------------------------------------------------
  // CORS
  // ------------------------------------------------

  const requestOrigin = req.headers.origin || ''
  const corsOrigin = ALLOWED_ORIGINS.includes(requestOrigin)
    ? requestOrigin
    : ALLOWED_ORIGINS[0]

  res.setHeader('Access-Control-Allow-Origin', corsOrigin)

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  )

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  )

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  try {
    // ------------------------------------------------
    // HEALTH CHECK
    // ------------------------------------------------

    if (req.method === 'GET' && req.url === '/health') {
      sendJson(res, 200, {
        ok: true,
        database: DB_NAME,
      })

      return
    }

    // =================================================
    // PROJECTS
    // =================================================

    // -------------------------------------------------
    // GET /projects
    // -------------------------------------------------

    if (req.method === 'GET' && req.url === '/projects') {
      const result = await projects
        .find({})
        .sort({ display_order: 1 })
        .toArray()

      sendJson(res, 200, {
        data: result,
      })

      return
    }

    // -------------------------------------------------
    // GET /projects/:id
    // -------------------------------------------------

    if (req.method === 'GET' && getProjectId(req)) {
      const id = getProjectId(req)

      const project = await projects.findOne({
        id,
      })

      sendJson(res, 200, {
        data: project || null,
      })

      return
    }

    // -------------------------------------------------
    // POST /projects
    // -------------------------------------------------

    if (req.method === 'POST' && req.url === '/projects') {
      const data = await readBody(req)

      const project = {
        ...data,

        id:
          data.id ||
          crypto.randomUUID(),

        created_at:
          data.created_at ||
          new Date().toISOString(),

        updated_at:
          new Date().toISOString(),
      }

      await projects.insertOne(project)

      console.log(
        'Project created:',
        project.id,
        project.title,
      )

      sendJson(res, 201, {
        data: project,
      })

      return
    }

    // -------------------------------------------------
    // PUT /projects/:id
    // -------------------------------------------------

    if (req.method === 'PUT' && getProjectId(req)) {
      const id = getProjectId(req)

      const data = await readBody(req)

      const updateData = {
        ...data,

        id,

        updated_at: new Date().toISOString(),
      }

      delete updateData._id

      const result = await projects.findOneAndUpdate(
        { id },
        {
          $set: updateData,
        },
        {
          returnDocument: 'after',
        },
      )

      if (!result) {
        sendJson(res, 404, {
          message: 'Project not found',
        })

        return
      }

      console.log(
        'Project updated:',
        id,
      )

      sendJson(res, 200, {
        data: result,
      })

      return
    }

    // -------------------------------------------------
    // DELETE /projects/:id
    // -------------------------------------------------

    if (req.method === 'DELETE' && getProjectId(req)) {
      const id = getProjectId(req)

      const result = await projects.deleteOne({
        id,
      })

      if (result.deletedCount === 0) {
        sendJson(res, 404, {
          message: 'Project not found',
        })

        return
      }

      console.log(
        'Project deleted:',
        id,
      )

      sendJson(res, 200, {
        data: null,
      })

      return
    }

    // =================================================
    // LEADS
    // =================================================
        // -------------------------------------------------
    // GET /api/leads
    // -------------------------------------------------

    if (req.method === 'GET' && req.url === '/api/leads') {
      const allLeads = await leads
        .find({})
        .sort({ createdAt: -1 })
        .toArray()

      // Map MongoDB _id → id string so the frontend can use lead.id for deletes
      const mapped = allLeads.map(({ _id, ...rest }) => ({
        id: _id.toString(),
        ...rest,
      }))

      sendJson(res, 200, mapped)

      return
    }
    // -------------------------------------------------
    // POST /api/leads
    // -------------------------------------------------

    if (req.method === 'POST' && req.url === '/api/leads') {
      const data = await readBody(req)

      const lead = {
        name: String(data.name || '').trim(),
        email: String(data.email || '').trim(),
        phone: String(data.phone || '').trim(),
        message: String(data.message || '').trim(),
        interest: String(
          data.interest || 'general',
        ).trim(),
        projectSlug: String(
          data.projectSlug || '',
        ).trim(),
        createdAt: new Date(),
      }

      if (!lead.name || !lead.phone) {
        sendJson(res, 400, {
          message: 'Name and phone are required',
        })

        return
      }

      const result = await leads.insertOne(lead)

      console.log(
        'New lead saved:',
        result.insertedId.toString(),
      )

      sendJson(res, 201, {
        id: result.insertedId.toString(),
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        interest: lead.interest,
        projectSlug: lead.projectSlug,
      })

      return
    }

    // -------------------------------------------------
    // DELETE /api/leads/:id
    // -------------------------------------------------

    const leadDeleteMatch = req.url.match(/^\/api\/leads\/([^/]+)$/)

    if (req.method === 'DELETE' && leadDeleteMatch) {
      const rawId = decodeURIComponent(leadDeleteMatch[1])

      let objectId
      try {
        objectId = new ObjectId(rawId)
      } catch {
        sendJson(res, 400, { message: 'Invalid lead id' })
        return
      }

      const result = await leads.deleteOne({ _id: objectId })

      if (result.deletedCount === 0) {
        sendJson(res, 404, { message: 'Lead not found' })
        return
      }

      console.log('Lead deleted:', rawId)
      sendJson(res, 200, { data: null })
      return
    }

    // =================================================
    // AMENITIES — stub CRUD (returns empty list / 501 for writes)
    // =================================================

    if (req.url === '/amenities' || req.url.match(/^\/amenities\/[^/]+$/)) {
      if (req.method === 'GET' && req.url === '/amenities') {
        sendJson(res, 200, { data: [] })
      } else {
        sendJson(res, 501, { message: 'Amenities write endpoints not yet implemented.' })
      }
      return
    }

    // =================================================
    // NEARBY PLACES — stub CRUD
    // =================================================

    if (req.url === '/nearby_places' || req.url.match(/^\/nearby_places\/[^/]+$/)) {
      if (req.method === 'GET' && req.url === '/nearby_places') {
        sendJson(res, 200, { data: [] })
      } else {
        sendJson(res, 501, { message: 'Nearby places write endpoints not yet implemented.' })
      }
      return
    }

    // =================================================
    // SITE CONTENT — stub CRUD
    // =================================================

    if (req.url === '/site_content' || req.url.match(/^\/site_content\/[^/]+$/)) {
      if (req.method === 'GET' && req.url === '/site_content') {
        sendJson(res, 200, { data: [] })
      } else {
        sendJson(res, 501, { message: 'Site content write endpoints not yet implemented.' })
      }
      return
    }

    // =================================================
    // PROJECT IMAGES — stub (gallery page)
    // =================================================

    if (req.method === 'GET' && req.url === '/project_images') {
      sendJson(res, 200, [])
      return
    }

    // =================================================
    // OMEGA ESTATES PLOTS
    // =================================================

    // GET /api/omega-plots
    if (req.method === 'GET' && req.url === '/api/omega-plots') {
      const result = await omegaPlots.find({}).sort({ plotNumber: 1 }).toArray()
      sendJson(res, 200, { data: result.map(p => ({ ...p, id: p._id.toString() })) })
      return
    }

    // GET /api/omega-plots/:id
    const omegaPlotMatch = req.url.match(/^\/api\/omega-plots\/([^/]+)$/)
    if (req.method === 'GET' && omegaPlotMatch) {
      const rawId = decodeURIComponent(omegaPlotMatch[1])
      try {
        const plot = await omegaPlots.findOne({ _id: new ObjectId(rawId) })
        if (!plot) return sendJson(res, 404, { message: 'Plot not found' })
        sendJson(res, 200, { data: { ...plot, id: plot._id.toString() } })
      } catch {
        sendJson(res, 400, { message: 'Invalid ID' })
      }
      return
    }

    // POST /api/omega-plots
    if (req.method === 'POST' && req.url === '/api/omega-plots') {
      const data = await readBody(req)
      const plot = {
        plotNumber: String(data.plotNumber || '').trim(),
        block: String(data.block || 'A').trim(),
        width: Number(data.width || 0),
        length: Number(data.length || 0),
        areaSqFt: Number(data.areaSqFt || 0),
        status: String(data.status || 'Available').trim(),
        notes: String(data.notes || '').trim(),
        images: Array.isArray(data.images) ? data.images : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const result = await omegaPlots.insertOne(plot)
      sendJson(res, 201, { data: { ...plot, id: result.insertedId.toString() } })
      return
    }

    // PUT /api/omega-plots/:id
    if (req.method === 'PUT' && omegaPlotMatch) {
      const rawId = decodeURIComponent(omegaPlotMatch[1])
      const data = await readBody(req)
      try {
        const objectId = new ObjectId(rawId)
        const updateData = {
          plotNumber: String(data.plotNumber || '').trim(),
          block: String(data.block || 'A').trim(),
          width: Number(data.width || 0),
          length: Number(data.length || 0),
          areaSqFt: Number(data.areaSqFt || 0),
          status: String(data.status || 'Available').trim(),
          notes: String(data.notes || '').trim(),
          images: Array.isArray(data.images) ? data.images : [],
          updatedAt: new Date().toISOString(),
        }
        await omegaPlots.updateOne({ _id: objectId }, { $set: updateData })
        const updated = await omegaPlots.findOne({ _id: objectId })
        sendJson(res, 200, { data: { ...updated, id: updated._id.toString() } })
      } catch {
        sendJson(res, 400, { message: 'Invalid ID' })
      }
      return
    }

    // DELETE /api/omega-plots/:id
    if (req.method === 'DELETE' && omegaPlotMatch) {
      const rawId = decodeURIComponent(omegaPlotMatch[1])
      try {
        const result = await omegaPlots.deleteOne({ _id: new ObjectId(rawId) })
        if (result.deletedCount === 0) return sendJson(res, 404, { message: 'Plot not found' })
        sendJson(res, 200, { data: null })
      } catch {
        sendJson(res, 400, { message: 'Invalid ID' })
      }
      return
    }

    // =================================================
    // GENERIC PROJECT PLOTS
    // =================================================

    // GET /api/project-plots?projectId={id}
    const projectPlotsBaseMatch = req.url.match(/^\/api\/project-plots(?:\?.*)?$/)
    if (req.method === 'GET' && projectPlotsBaseMatch) {
      const urlObj = new URL(req.url, `http://${req.headers.host}`)
      const projectId = urlObj.searchParams.get('projectId')
      const query = projectId ? { projectId } : {}
      const result = await projectPlots.find(query).sort({ plotNumber: 1 }).toArray()
      sendJson(res, 200, { data: result.map(p => ({ ...p, id: p._id.toString() })) })
      return
    }

    // GET /api/project-plots/:id
    const projectPlotMatch = req.url.match(/^\/api\/project-plots\/([^/]+)$/)
    if (req.method === 'GET' && projectPlotMatch) {
      const rawId = decodeURIComponent(projectPlotMatch[1])
      try {
        const plot = await projectPlots.findOne({ _id: new ObjectId(rawId) })
        if (!plot) return sendJson(res, 404, { message: 'Plot not found' })
        sendJson(res, 200, { data: { ...plot, id: plot._id.toString() } })
      } catch {
        sendJson(res, 400, { message: 'Invalid ID' })
      }
      return
    }

    // POST /api/project-plots
    if (req.method === 'POST' && projectPlotsBaseMatch) {
      const data = await readBody(req)
      const plot = {
        projectId: String(data.projectId || '').trim(),
        plotNumber: String(data.plotNumber || '').trim(),
        block: String(data.block || 'A').trim(),
        width: Number(data.width || 0),
        length: Number(data.length || 0),
        areaSqFt: Number(data.areaSqFt || 0),
        facing: String(data.facing || '').trim(),
        status: String(data.status || 'Available').trim(),
        price: data.price ? Number(data.price) : null,
        description: String(data.description || '').trim(),
        images: Array.isArray(data.images) ? data.images : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const result = await projectPlots.insertOne(plot)
      sendJson(res, 201, { data: { ...plot, id: result.insertedId.toString() } })
      return
    }

    // PUT /api/project-plots/:id
    if (req.method === 'PUT' && projectPlotMatch) {
      const rawId = decodeURIComponent(projectPlotMatch[1])
      const data = await readBody(req)
      try {
        const objectId = new ObjectId(rawId)
        const updateData = {
          projectId: String(data.projectId || '').trim(),
          plotNumber: String(data.plotNumber || '').trim(),
          block: String(data.block || 'A').trim(),
          width: Number(data.width || 0),
          length: Number(data.length || 0),
          areaSqFt: Number(data.areaSqFt || 0),
          facing: String(data.facing || '').trim(),
          status: String(data.status || 'Available').trim(),
          price: data.price ? Number(data.price) : null,
          description: String(data.description || '').trim(),
          images: Array.isArray(data.images) ? data.images : [],
          updatedAt: new Date().toISOString(),
        }
        await projectPlots.updateOne({ _id: objectId }, { $set: updateData })
        const updated = await projectPlots.findOne({ _id: objectId })
        sendJson(res, 200, { data: { ...updated, id: updated._id.toString() } })
      } catch {
        sendJson(res, 400, { message: 'Invalid ID' })
      }
      return
    }

    // DELETE /api/project-plots/:id
    if (req.method === 'DELETE' && projectPlotMatch) {
      const rawId = decodeURIComponent(projectPlotMatch[1])
      try {
        const result = await projectPlots.deleteOne({ _id: new ObjectId(rawId) })
        if (result.deletedCount === 0) return sendJson(res, 404, { message: 'Plot not found' })
        sendJson(res, 200, { data: null })
      } catch {
        sendJson(res, 400, { message: 'Invalid ID' })
      }
      return
    }

    // ------------------------------------------------
    // NOT FOUND
    // ------------------------------------------------
    sendJson(res, 404, {
      message: 'Not found',
    })
  } catch (error) {
    console.error('API error:', error)

    sendJson(res, 500, {
      message: 'Internal server error',
      error:
        error instanceof Error
          ? error.message
          : String(error),
    })
  }
})

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

server.listen(PORT, '0.0.0.0', () => {
  console.log(
    `API server running at http://0.0.0.0:${PORT}`,
  )
})