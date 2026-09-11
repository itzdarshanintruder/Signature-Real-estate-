const mongoose = require('mongoose')

const galleryItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ['Master Plan', 'Lifestyle', 'Progress', 'Approvals'],
      default: 'Lifestyle',
      index: true,
    },
    src: { type: String, default: null },
    alt: { type: String, default: '' },
    caption: { type: String, default: null },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('GalleryItem', galleryItemSchema)