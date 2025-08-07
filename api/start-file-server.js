// /api/start-file-server.js
import { MongoClient } from "mongodb";
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET allowed" });
  }

  const { secret } = req.query;

  if (secret !== process.env.SECRET) {
    return res.status(403).json({ error: "Invalid secret" });
  }

  try {
    // 1. Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db(); // use default DB from URI
    const tokensCollection = db.collection("tokens");

    // 2. Get the latest FCM token
    const latestTokenEntry = await tokensCollection.findOne({}, { sort: { _id: -1 } });

    if (!latestTokenEntry || !latestTokenEntry.token) {
      return res.status(404).json({ error: "No FCM token found" });
    }

    const fcmToken = latestTokenEntry.token;

    // 3. Send push message
    const fcmResponse = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Authorization": `key=${process.env.FCM_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: fcmToken,
        data: {
          command: "start-file-server"
        }
      })
    });

    const result = await fcmResponse.json();

    return res.status(200).json({
      message: "File server start command sent successfully",
      fcmResponse: result
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
