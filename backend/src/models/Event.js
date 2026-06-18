const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  eventType: {
    type: String,
    enum: ['page_view', 'click'],
    required: true,
    index: true,
  },
  pageUrl: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  metadata: {
    x: { type: Number },
    y: { type: Number },
  },
});

module.exports = mongoose.model('Event', eventSchema);
