const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: String,
  android_id: String,
  device_model: String,
  manufacturer: String,
  fingerprint: String,
  timestamp: Number,
  datetime: String
});

const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);

let conn = null;
async function connectToDB() {
  if (conn == null) {
    conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const {
      token,
      android_id,
      device_model,
      manufacturer,
      fingerprint,
      timestamp,
      datetime
    } = req.body;

    if (!token || !android_id || !device_model) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await connectToDB();

    const newToken = new Token({
      token,
      android_id,
      device_model,
      manufacturer,
      fingerprint,
      timestamp,
      datetime
    });

    await newToken.save();

    return res.status(200).json({ message: "Token and device info saved" });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};
