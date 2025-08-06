const dbConnect = require('./db');
const TokenModel = require('./models/Token'); // Same as used for saving tokens

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const devices = await TokenModel.find().sort({ datetime: -1 });
    res.status(200).json(devices);
  } catch (error) {
    console.error("Fetch Devices Error:", error);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
};
