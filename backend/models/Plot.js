const mongoose = require('mongoose')

const plotImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    url: { type: String, default: null },
    file_name: { type: String, default: '' },
    size: { type: Number, default: null },
    is_cover: { type: Boolean, default: false },
    position: { type: Number, default: 0 },
    alt: { type: String, default: null },
  },
  { _id: false },
)

const plotSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, default: '' },
    plot_number: { type: String, default: '' },
    area: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['available', 'sold', 'reserved', 'coming-soon'],
      default: 'available',
      index: true,
    },
    amenities: { type: [String], default: [] },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    gallery: { type: [plotImageSchema], default: [] },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Plot', plotSchema)