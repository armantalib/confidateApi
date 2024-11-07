const mongoose = require('mongoose');

const voiceCodes = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  voice_code: {
    type: String,
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

module.exports = mongoose.model('VoiceCodes', voiceCodes);
