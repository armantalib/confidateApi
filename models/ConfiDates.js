const mongoose = require('mongoose');

const confiDates = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  name: {
    type: String,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
  },
  contact: {
    type: String,
  },
  address: {
    type: String,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
});

module.exports = mongoose.model('ConfiDates', confiDates);
