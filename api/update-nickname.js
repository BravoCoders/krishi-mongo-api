const dbConnect = require('./db');
const TokenModel = require('./models/Token');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { android_id, nickname } = req.body;

  if (!android_id || !nickname) {
    return res.status(400).json({ error: "Missing android_id or nickname" });
  }

  try {
    const updated = await TokenModel.findOneAndUpdate(
      { android_id },
      { nickname },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.status(200).json({ message: "Nickname updated", data: updated });
  } catch (err) {
    console.error("Nickname update error:", err);
    res.status(500).json({ error: "Failed to update nickname" });
  }
};
