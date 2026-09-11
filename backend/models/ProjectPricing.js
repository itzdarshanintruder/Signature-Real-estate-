const mongoose = require('mongoose')

const projectPricingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    project_id: { type: String, required: true, index: true },
    size: { type: String, required: true },
    dimensions: { type: String, required: true },
    start_price_inr: { type: Number, required: true, min: 0 },
    note: { type: String, default: null },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('ProjectPricing', projectPricingSchema)