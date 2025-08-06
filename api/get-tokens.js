import { connect } from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // ✅ Secret Key Check
  const secret = req.headers['x-access-key'];
  if (secret !== 'BravoAccess321') {
    return res.status(403).json({ error: 'Forbidden: Invalid access key' });
  }

  try {
    // ✅ Connect to MongoDB
    await connect(process.env.MONGO_URI);

    // ✅ Define model inline (or use external schema if defined elsewhere)
    const TokenModel = mongoose.models.token || mongoose.model('token', new mongoose.Schema({}, { strict: false }));

    const devices = await TokenModel.find().lean();

    res.status(200).json({ success: true, data: devices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
