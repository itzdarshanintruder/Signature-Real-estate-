const User = require('../models/User')
const { signToken, hashPassword, verifyPassword } = require('../middleware/auth')

function toUserDto(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name || null,
    role: user.role || null,
    created_at: user.created_at ? user.created_at.getTime() : user.updated_at.getTime(),
  }
}

/** POST /auth/login — { email, password } -> { authToken }. */
async function login(req, res, next) {
  try {
    const { email, password } = req.body || {}

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.', code: 'VALIDATION_ERROR' })
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() })
    if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid email or password.', code: 'AUTH_FAILED' })
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
    })

    return res.json({ authToken: token })
  } catch (err) {
    return next(err)
  }
}

/** GET /auth/me — current authenticated admin user. */
async function me(req, res, next) {
  try {
    const user = await User.findOne({ id: req.user.id })
    if (!user) {
      return res.status(404).json({ message: 'User not found.', code: 'NOT_FOUND' })
    }
    return res.json(toUserDto(user))
  } catch (err) {
    return next(err)
  }
}

module.exports = { login, me }