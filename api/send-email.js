const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required" });
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
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
};
