const mongoose = require('mongoose');

const emergencyContact = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  name: {
    type: String,
  },
  contact: {
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

module.exports = mongoose.model('EmergencyContacts', emergencyContact);
