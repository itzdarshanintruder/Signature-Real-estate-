const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    status: {
      type: String,
      enum: ['available', 'premium', 'launching', 'sold-out'],
      default: 'available',
      index: true,
    },
    district: { type: String, required: true, index: true },
    location: { type: String, required: true },
    plot_sizes: { type: [String], default: [] },
    starting_price_inr: { type: Number, default: null, index: true },
    acreage: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    short_description: { type: String, default: '' },
    overview: { type: [String], default: [] },
    features: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    investment_benefits: { type: [String], default: [] },
    is_featured: { type: Boolean, default: false, index: true },
    display_order: { type: Number, default: 0 },
    map_url: { type: String, default: null },
    is_active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Project', projectSchema)