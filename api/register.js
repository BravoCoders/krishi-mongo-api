const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// MongoDB connection
console.log("Attempting to connect to MongoDB");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// POST /api/register
app.post("/api/register", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = new User({ name, email, mobile, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ This is required for Vercel to recognize it as a serverless function
module.exports = app;
