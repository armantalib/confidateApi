const mongoose = require('mongoose');

const schemeQuiz = new mongoose.Schema({

  title: {
    type: String,
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

module.exports = mongoose.model('Grade', schemeQuiz);
