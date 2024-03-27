const bcrypt = require("bcrypt");
const crypto = require("crypto");
const _4psModel = require("../models/_4psUserSchema"); 
const seniorModel = require("../models/seniorUserSchema");
const userModel = require("../models/LGUuserSchema");
const ResetToken = require("../models/ResetToken");
const { sendEmail } = require('../middleware/nodemailerMiddleware');
const generateResetToken = require("../middleware/generateResetToken");

const forgotPassword = async (req, res) => {
  const { userId: providedUserId, email } = req.body;

  if (!providedUserId || !email) {
    return res
      .status(400)
      .json({ error: "Both userId and email are required" });
  }

  try {
    // Find the user with the provided userId in any of the models
    let user = await _4psModel
      .findOne({ userId: providedUserId })
      .populate("records");
    if (!user) {
      user = await seniorModel
        .findOne({ userId: providedUserId })
        .populate("records");
      if (!user) {
        user = await userModel
          .findOne({ userId: providedUserId })
          .populate("profile");
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
      }
    }

    // Check if the provided email matches the user's email
    const userEmail = user.records ? user.records.email : user.profile.email;
    if (userEmail !== email) {
      return res
        .status(400)
        .json({ error: "Email does not match the user's email" });
    }

    const userId = user.userId; // Assign userId from the found user

    const resetIdentifier = crypto.randomBytes(20).toString("hex");

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getMinutes() + 5);

    // Save the reset identifier and its association with the user in the database
    await ResetToken.create({ identifier: resetIdentifier, userId, expiresAt });

    // Send the reset password link via email
    const resetLink = `http://localhost:5173/reset-password/${resetIdentifier}`;
    const subject = "Password Reset Link";
    const html = `<p>Click the following link to reset your password: <a href="${resetLink}">Reset Password</a></p>`;

    // Call the sendEmail middleware to send the email
    await sendEmail(email, subject, html);

    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { resetIdentifier } = req.params; // Retrieve reset identifier from route parameters
  const { newPassword } = req.body;

  try {
    // Find the reset token in the database
    const resetTokenEntry = await ResetToken.findOne({
      identifier: resetIdentifier,
    });

    if (!resetTokenEntry) {
      return res.status(404).json({ error: "Invalid or expired reset link" });
    }

    const userId = resetTokenEntry.userId;

    // Define the user model based on userId pattern
    let user;
    if (userId.includes("4ps")) {
      user = await _4psModel.findOne({ userId });
    } else if (userId.includes("sen")) {
      user = await seniorModel.findOne({ userId });
    } else {
      user = await userModel.findOne({ userId });
    }

    // If user not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure newPassword is provided and not empty
    if (!newPassword || newPassword.trim() === "") {
      console.error("New password is missing or empty.");
      return res.status(400).json({ error: "New password is required" });
    }

    console.log("New password:", newPassword, userId); // Log correct userId

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset token
    user.password = hashedPassword;
    await user.save();

    // Remove the reset token entry from the database
    await ResetToken.deleteOne({ identifier: resetIdentifier });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { forgotPassword, resetPassword };
