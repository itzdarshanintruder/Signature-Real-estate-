const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    interest: {
      type: String,
      enum: ['site-visit', 'brochure', 'invest', 'general'],
      default: 'general',
    },
    project_slug: { type: String, default: null },
    message: { type: String, default: '', maxlength: 2000 },
    consent: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
)

module.exports = mongoose.model('Lead', leadSchema)