const mongoose = require('mongoose');

const safetyResources = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  type: {
    type: String,
    default: 'legal',
    enum: ['legal', "safety"]
  },
  active: {
    type: Boolean,
    default:false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
});

module.exports = mongoose.model('SafetyResources', safetyResources);
