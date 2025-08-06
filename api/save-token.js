const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: String,
  android_id: String,
  manufacturer: String,
  model: String,
  fingerprint: String,
  nickname: String, // Can be added from admin panel later
  timestamp: Number,
  datetime: String
});

const TokenModel = mongoose.models.Token || mongoose.model('Token', tokenSchema);

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
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { token, android_id, manufacturer, model, fingerprint, timestamp, datetime } = req.body;

    if (!token || !android_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await connectToDB();

    const existing = await TokenModel.findOne({ android_id });

    if (existing) {
      existing.token = token;
      existing.timestamp = timestamp;
      existing.datetime = datetime;
      await existing.save();
      return res.status(200).json({ message: "Token updated" });
    } else {
      const entry = new TokenModel({
        token,
        android_id,
        manufacturer,
        model,
        fingerprint,
        timestamp,
        datetime,
        nickname: "" // Placeholder for admin to set later
      });
      await entry.save();
      return res.status(200).json({ message: "Token saved" });
    }

  } catch (err) {
    console.error("Token save error:", err.message);
    return res.status(500).json({ error: "Server Error", details: err.message });
  }
};
