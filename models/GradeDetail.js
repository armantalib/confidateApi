const mongoose = require('mongoose');

const schemeQuiz = new mongoose.Schema({
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade',
    required: true,
  },
  title: {
    type: String,
  },
  title_t: {
    type: String,
  },
  desc: {
    type: String,
  },
  desc_t: {
    type: String,
  },
  points_min: {
    type: Number,
  },
  points_max: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
});

module.exports = mongoose.model('GradeDetail', schemeQuiz);
