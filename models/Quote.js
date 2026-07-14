const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    pcbType: { type: String, required: true },
    serviceRequired: { type: String, required: true },
    description: { type: String, required: true },
    attachments: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        path: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'quoted', 'accepted', 'rejected'],
      default: 'pending',
    },
    adminNotes: { type: String, default: '' },
    quotedPrice: { type: Number, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quote', quoteSchema);
