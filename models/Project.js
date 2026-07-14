const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    summary: { type: String, required: true },
    detail: { type: String, required: true },
    notes: [{ type: String }],
    frontImage: { type: String, default: '' },
    backImage: { type: String, default: '' },
    size: { type: String, enum: ['normal', 'large', 'wide'], default: 'normal' },
    category: { type: String, default: 'pcb' },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
