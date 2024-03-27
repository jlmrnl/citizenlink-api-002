const mongoose = require("mongoose");

const resetTokenSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  userId: { type: String, required: true },
  expiresAt: {
    type: Date,
    required: true,
    default: () => Date.now() + 5 * 60 * 1000
  }
});

const ResetToken = mongoose.model("ResetToken", resetTokenSchema);

module.exports = ResetToken;
