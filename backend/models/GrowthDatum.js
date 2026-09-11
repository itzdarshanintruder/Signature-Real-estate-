const mongoose = require('mongoose')

const growthDatumSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    // null = site-wide series; value = per-project override series.
    project_id: { type: String, default: null, index: true },
    year: { type: String, required: true },
    value: { type: Number, required: true },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('GrowthDatum', growthDatumSchema)