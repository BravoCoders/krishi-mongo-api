// api/get-tokens.js
import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI || 'your_mongodb_connection_url';
const secretKey = 'BravoAccess321';

// Define schema
const TokenSchema = new mongoose.Schema({
  android_id: String,
  model: String,
  nickname: String,
  token: String,
});

// Define model (avoid overwrite error on re-deploy)
const Token = mongoose.models.Token || mongoose.model('Token', TokenSchema);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check secret key in header or query
  const userSecret = req.headers['x-api-key'] || req.query.secret;
  if (userSecret !== secretKey) {
    return res.status(401).json({ error: 'Unauthorized - Invalid secret' });
  }

  try {
    await mongoose.connect(mongoURI);

    const data = await Token.find({});

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}
