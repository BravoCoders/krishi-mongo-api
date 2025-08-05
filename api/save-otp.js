const mongoose = require('mongoose');
const dbConnect = require('./db'); // Make sure you already have this
const OtpModel = require('./models/Otp'); // We'll create this model

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message, timestamp } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const otpDoc = await OtpModel.create({ message, timestamp });
    res.status(201).json({ message: "OTP saved", data: otpDoc });
  } catch (err) {
    console.error("Save OTP error:", err.message);
    res.status(500).json({ error: "Failed to save OTP" });
  }
};
