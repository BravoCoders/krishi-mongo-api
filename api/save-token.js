// api/save-token.js

const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: String,
  deviceId: String,
  timestamp: { type: Date, default: Date.now }
});

const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);

// MongoDB connection
async function connectToDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, deviceId } = req.body;

  if (!token) {
    return res.status(400).json({ error: "FCM token is required" });
  }

  try {
    await connectToDB();

    const newToken = new Token({ token, deviceId });
    await newToken.save();

    return res.status(200).json({ message: "Token saved successfully" });
  } catch (error) {
    console.error("Save Token Error:", error.message);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};
