const nodemailer = require('nodemailer');

// Helper to parse body in Vercel serverless functions
const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', err => reject(err));
  });

module.exports = async (req, res) => {
  try {
    const raw = await getRawBody(req);
    const { email, subject, message } = JSON.parse(raw);

    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required" });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_ID,
      to: email,
      subject: subject || "Message from Krishi-Mitra",
      text: message,
    });

    res.status(200).json({ message: "Email sent successfully" });

  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
};
