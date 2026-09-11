const { dbState } = require('../config/db')

/** GET /health — server + MongoDB status. Never fails the request. */
function health(_req, res) {
  const database = dbState()
  res.status(200).json({
    status: database === 'connected' ? 'ok' : 'degraded',
    database,
  })
}

module.exports = { health }