const mongoose = require('mongoose')

const amenitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: '', maxlength: 200 },
    icon: { type: String, required: true },
    category: { type: String, default: '' },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Amenity', amenitySchema)