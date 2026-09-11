const mongoose = require('mongoose')

const faqSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    // null = site-wide FAQ; value = project-specific FAQ.
    project_id: { type: String, default: null, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Faq', faqSchema)