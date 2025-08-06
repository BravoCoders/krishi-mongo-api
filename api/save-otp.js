// api/save-otp.js

const dbConnect = require('./db');
const OtpModel = require('./models/Otp');

module.exports = async (req, res) => {
  // Connect to MongoDB
  await dbConnect();

  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { message, timestamp } = req.body;

  // Validate
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Save OTP to database
    const otpDoc = await OtpModel.create({
      message,
      timestamp: timestamp || Date.now()
    });

    return res.status(201).json({ message: "OTP saved", data: otpDoc });
  } catch (err) {
    console.error("Save OTP error:", err.message);
    return res.status(500).json({ error: "Failed to save OTP" });
  }
};
