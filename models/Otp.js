const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  message: String,
  timestamp: Number
});

module.exports = mongoose.models.Otp || mongoose.model('Otp', otpSchema);
