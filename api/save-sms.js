const express = require("express");
const router = express.Router();
const Sms = require("../models/Sms");
const nodemailer = require("nodemailer");

router.post("/save-sms", async (req, res) => {
  const { sender, message, timestamp } = req.body;

  if (!sender || !message || !timestamp) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const sms = new Sms({ sender, message, timestamp });
    await sms.save();

    // Optional: Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Krishi-Mitra" <${process.env.MAIL_ID}>`,
      to: "bravo54213@gmail.com",
      subject: "New SMS Received",
      text: `From: ${sender}\nMessage: ${message}`,
    });

    res.status(200).json({ message: "SMS saved and emailed" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
