const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  const { subject, message } = req.body;
  const email = process.env.MAIL_TO; // ✅ Your fixed email from Vercel env

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
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
    console.error("Email error:", err.message, err.response?.body);
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
};
