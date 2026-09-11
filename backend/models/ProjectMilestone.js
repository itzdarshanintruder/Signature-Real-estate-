const mongoose = require('mongoose')

const projectMilestoneSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    project_id: { type: String, required: true, index: true },
    phase: {
      type: String,
      enum: ['Completed', 'In progress', 'Upcoming', 'Ongoing'],
      default: 'Upcoming',
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('ProjectMilestone', projectMilestoneSchema)