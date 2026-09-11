const mongoose = require('mongoose')

const nearbyPlaceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    project_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['School', 'Hospital', 'Shopping', 'Connectivity', 'Transit', 'Recreation'],
      index: true,
    },
    distance: { type: String, default: '' },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('NearbyPlace', nearbyPlaceSchema)