const mongoose = require('mongoose');

const schemeQuiz = new mongoose.Schema({

  title: {
    type: String,
  },
  title_t: {
    type: String,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  type: {
    type: String,
    default: 'mcq',
    enum: ['mcq','single']
  },
  options:[],
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

module.exports = mongoose.model('Question', schemeQuiz);
