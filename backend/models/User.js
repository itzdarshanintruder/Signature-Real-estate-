const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, default: '' },
    role: {
      type: String,
      enum: ['admin', 'sales', 'editor', 'viewer'],
      default: 'viewer',
    },
    password_salt: { type: String, required: true },
    password_hash: { type: String, required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('User', userSchema)