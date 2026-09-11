const crypto = require('node:crypto')

// HMAC secret for signing admin tokens. Falls back to a per-process random
// secret (tokens invalidated on restart) when JWT_SECRET is not configured.
let fallbackSecret = null
const secret = () => {
  const env = process.env.JWT_SECRET
  if (env) return Buffer.from(env, 'utf8')
  if (!fallbackSecret) {
    fallbackSecret = crypto.randomBytes(32)
    console.warn('[auth] JWT_SECRET not set — using a temporary random secret (tokens reset on restart).')
  }
  return fallbackSecret
}

function base64url(input) {
  return Buffer.from(input).toString('base64url')
}

function fromB64url(str) {
  return Buffer.from(str, 'base64url')
}

/** Create a signed HS256 JWT-shaped token for a user. */
function signToken(payload) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify(payload))
  const signature = crypto
    .createHmac('sha256', secret())
    .update(`${header}.${body}`)
    .digest('base64url')
  return `${header}.${body}.${signature}`
}

/** Verify a token. Returns the decoded payload or null. */
function verifyToken(token) {
  if (typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, body, signature] = parts
  const expected = crypto
    .createHmac('sha256', secret())
    .update(`${header}.${body}`)
    .digest('base64url')
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(fromB64url(body).toString('utf8'))
    if (typeof payload.exp === 'number' && payload.exp < Date.now() / 1000) return null
    return payload
  } catch {
    return null
  }
}

/** Express middleware: require a valid `Authorization: Bearer <token>`. */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required.' })
  }
  const payload = verifyToken(token)
  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired session.' })
  }
  req.user = { id: payload.sub, email: payload.email, role: payload.role }
  next()
}

/** Hash a password with scrypt + per-user salt (hex from crypto). */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex')
  return { salt, hash }
}

/** Verify a plaintext password against stored salt + hash. */
function verifyPassword(password, salt, hash) {
  const candidate = crypto.scryptSync(String(password), String(salt), 64)
  const stored = Buffer.from(String(hash), 'hex')
  if (candidate.length !== stored.length) return false
  return crypto.timingSafeEqual(candidate, stored)
}

module.exports = { requireAuth, signToken, hashPassword, verifyPassword }