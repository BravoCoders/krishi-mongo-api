// api/get-tokens.js

import dbConnect from "../lib/dbConnect";
import Device from "../models/Device";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const secret = req.query.secret || req.headers['x-api-key'];
  if (secret !== "BravoAccess321") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    await dbConnect();
    const devices = await Device.find({});
    return res.status(200).json({ success: true, data: devices });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch devices" });
  }
}
