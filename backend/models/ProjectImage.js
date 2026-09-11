const mongoose = require('mongoose')

const projectImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    project_id: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ['hero', 'gallery', 'master_plan'],
      default: 'gallery',
      index: true,
    },
    sort_order: { type: Number, default: 0 },
    src: { type: String, default: null },
    alt: { type: String, default: '' },
    caption: { type: String, default: null },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

projectImageSchema.index({ project_id: 1, role: 1, sort_order: 1 })

module.exports = mongoose.model('ProjectImage', projectImageSchema)