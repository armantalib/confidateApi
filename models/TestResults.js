const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  result: {
    type: String,
  },
  test_image: {
    type: String,
  },
  type: {
    type: String,
    default: 'border',
    enum: ['phys', "border"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
});

module.exports = mongoose.model('TestResults', testResultSchema);
