const mongoose = require('mongoose')

const SITE_CONTENT_KEYS = [
  'hero',
  'hero_card',
  'trust_bar',
  'stats',
  'location',
  'premium_plots',
  'investment',
  'investment_growth_ref',
  'why_choose',
  'about',
  'journey',
  'amenity_pillars',
]

const siteContentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      enum: SITE_CONTENT_KEYS,
    },
    // Typed JSON block matching the public section shape.
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    version: { type: Number, default: 1 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('SiteContent', siteContentSchema)