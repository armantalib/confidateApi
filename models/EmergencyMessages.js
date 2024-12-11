const mongoose = require('mongoose');

const emergencyMessagesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  message: {
    type: String,

  },
  message_t: {
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

module.exports = mongoose.model('EmergencyMessages', emergencyMessagesSchema);
