const mongoose = require('mongoose')
const env = { ...process.env }

function toErrorCode(name) {
  switch (name) {
    case 'ValidationError':
      return 'VALIDATION_ERROR'
    case 'CastError':
      return 'INVALID_ID'
    default:
      return name || 'INTERNAL_ERROR'
  }
}

/** 404 handler — mounted after all routes. */
function notFound(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
  })
}

/** Centralized error handler — the last middleware in the stack. */
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)

  // Mongoose validation errors -> 400 with actionable field messages.
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message]),
    )
    return res.status(400).json({
      message: err.message,
      code: 'VALIDATION_ERROR',
      details,
    })
  }

  // Invalid ObjectId / malformed uuid lookup.
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: 'Invalid id in request.',
      code: 'INVALID_ID',
    })
  }

  // Duplicate key (unique index) -> 409.
  if (err && err.code === 11000) {
    return res.status(409).json({
      message: 'A record with the same unique value already exists.',
      code: 'CONFLICT',
    })
  }

  // multer errors.
  if (err && err.name === 'MulterError') {
    return res.status(400).json({
      message: err.message,
      code: 'UPLOAD_ERROR',
    })
  }

  // API-friendly errors thrown by controllers ({ status, message, code }).
  if (err && typeof err.status === 'number') {
    return res.status(err.status).json({
      message: err.message || 'Request failed.',
      code: err.code || 'REQUEST_ERROR',
      details: err.details,
    })
  }

  if (err && err.name === 'MongoServerError') {
    return res.status(500).json({
      message: 'Database operation failed.',
      code: 'DB_ERROR',
    })
  }

  // Never leak stack traces or environment values (credentials stay secret).
  console.error('[error]', err)
  res.status(500).json({
    message: env.NODE_ENV === 'production' ? 'Internal server error.' : 'Internal server error.',
    code: 'INTERNAL_ERROR',
  })
}

module.exports = { notFound, errorHandler }