const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: String,
  android_id: { type: String, unique: true },
  manufacturer: String,
  model: String,
  fingerprint: String,
  timestamp: Number,
  datetime: String,
  nickname: { type: String, default: "" }
});

module.exports = mongoose.models.Token || mongoose.model('Token', tokenSchema);
