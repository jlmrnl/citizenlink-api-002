const mongoose = require("mongoose");

const resetTokenSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  userId: { type: String, required: true }, // Change the type to String
  createdAt: { type: Date, default: Date.now, expires: "1h" },
});

const ResetToken = mongoose.model("ResetToken", resetTokenSchema);

module.exports = ResetToken;
