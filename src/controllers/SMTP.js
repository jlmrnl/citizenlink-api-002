const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const _4psModel = require('../models/_4psUserSchema'); // Update with your user model
const seniorModel = require('../models/seniorUserSchema'); // Update with your senior user model
const userModel = require('../models/LGUuserSchema'); // Update with your admin user model
const generateResetToken = require('../middleware/generateResetToken');

require('dotenv').config();

  const forgotPassword = async (req, res) => {
    const { userId, email } = req.body;

    if (!userId || !email) {
        return res.status(400).json({ error: "Both userId and email are required" });
    };

    try {
        // Check if the user with the provided userId exists
        const user = await _4psModel.findOne({ userId }).populate('records');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the provided email matches the user's email
        if (user.records.email !== email) {
            return res.status(400).json({ error: "Email does not match the user's email" });
        }

        // Generate a unique token for password reset (You can use crypto or any other library for this purpose)
        const resetToken = generateResetToken(user.userId);

        // Save the reset token to the user document in the database
        user.resetToken = resetToken;
        await user.save();

        // Send the reset password link via email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: 'jlmrnl001@gmail.com',
            to: email,
            subject: 'Password Reset Link',
            html: `<p>Click the following link to reset your password: <a href="http://yourwebsite.com/reset-password/${resetToken}">Reset Password</a></p></br>
            <p>token: ${resetToken}</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset link sent successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { forgotPassword };
