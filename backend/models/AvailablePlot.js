const mongoose = require('mongoose')

const availablePlotSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    project_id: { type: String, required: true, index: true },
    size: { type: String, required: true },
    dimensions: { type: String, required: true },
    facing: { type: String, required: true },
    price_inr: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold'],
      default: 'available',
      index: true,
    },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('AvailablePlot', availablePlotSchema)