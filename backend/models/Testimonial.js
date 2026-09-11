const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    quote: { type: String, required: true, maxlength: 1000 },
    name: { type: String, required: true, maxlength: 80 },
    role: { type: String, default: '', maxlength: 60 },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Testimonial', testimonialSchema)