const admin = require("firebase-admin");

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, topic, action, secret } = req.body;

  // 🛡️ Verify secret
  if (secret !== "BravoAccess321") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!action || (!token && !topic)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const message = {
    data: { action },
    ...(token ? { token } : { topic }),
  };

  try {
    const response = await admin.messaging().send(message);
    return res.status(200).json({ success: true, response });
  } catch (err) {
    console.error("FCM Send Error:", err);
    return res.status(500).json({ error: "Failed to send message", details: err.message });
  }
};
