const mongoose = require('mongoose')

/**
 * Connect to MongoDB via the MONGODB_URI environment variable.
 * Connection is attempted lazily so the Express server can still boot
 * (and report a degraded /health) when MongoDB is not reachable.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to backend/.env.')
  }
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  })
}

function dbState() {
  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected'
    case 2:
      return 'connecting'
    case 3:
      return 'disconnecting'
    default:
      return 'disconnected'
  }
}

function isDBConnected() {
  return mongoose.connection.readyState === 1
}

module.exports = { connectDB, dbState, isDBConnected }