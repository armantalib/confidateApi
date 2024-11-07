const mongoose = require('mongoose');

const schemeQuiz = new mongoose.Schema({

  title: {
    type: String,
  },
  title_t: {
    type: String,
  },
  description: {
    type: String,
  },
  description_t: {
    type: String,
  },
  cost: {
    type: String,
  },
  grade_system: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
});

module.exports = mongoose.model('Quiz', schemeQuiz);
