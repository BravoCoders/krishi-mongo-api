const admin = require("firebase-admin");

// ✅ Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { token, topic, action, secret } = req.body;

  // ✅ Security: Validate secret key
  if (secret !== "BravoAccess321") {
    return res.status(401).json({ error: "Unauthorized - Invalid Secret" });
  }

  // ✅ Validate payload
  if (!action || (!token && !topic)) {
    return res.status(400).json({ error: "Missing required fields: 'action' and either 'token' or 'topic'" });
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
    return res.status(500).json({ error: "FCM Send Failed", details: err.message });
  }
};
