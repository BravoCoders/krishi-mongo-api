import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI; // Make sure this is set in Vercel dashboard
const client = new MongoClient(uri);
const DB_NAME = "Krishi-Mitra-DB";
const COLLECTION = "DeviceTokens";

export default async function handler(req, res) {
  const secret = req.headers["x-access-key"];

  if (secret !== "BravoAccess321") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  if (req.method === "GET") {
    try {
      await client.connect();
      const collection = client.db(DB_NAME).collection(COLLECTION);
      const devices = await collection.find().toArray();
      res.status(200).json({ data: devices });
    } catch (err) {
      console.error("Error fetching devices:", err);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
