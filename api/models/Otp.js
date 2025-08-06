const mongoose = require('mongoose');

// Define OTP schema
const OtpSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    default: Date.now,
  }
});

// Export model with safeguard for Vercel's hot-reload
module.exports = mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
