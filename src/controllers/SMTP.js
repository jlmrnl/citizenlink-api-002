const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const _4psModel = require('../models/_4psUserSchema'); // Update with your user model
const seniorModel = require('../models/seniorUserSchema'); // Update with your senior user model
const userModel = require('../models/LGUuserSchema'); // Update with your admin user model
const generateResetToken = require('../middleware/generateResetToken');

require('dotenv').config();

const forgotPassword = async (req, res) => {
    const { userId: providedUserId, email } = req.body; // Rename userId to providedUserId to avoid collision

    if (!providedUserId || !email) {
        return res.status(400).json({ error: "Both userId and email are required" });
    }

    try {
        // Find the user with the provided userId in any of the models
        let user = await _4psModel.findOne({ userId: providedUserId }).populate('records');
        if (!user) {
            user = await seniorModel.findOne({ userId: providedUserId }).populate('records');
            if (!user) {
                user = await userModel.findOne({ userId: providedUserId }).populate('profile');
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }
            }
        }

        // Check if the provided email matches the user's email
        const userEmail = user.records ? user.records.email : user.profile.email;
        if (userEmail !== email) {
            return res.status(400).json({ error: "Email does not match the user's email" });
        }

        const userId = user.userId; // Assign userId from the found user

        // Generate a unique token for password reset
        const resetToken = generateResetToken(userId);

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
            </br><p>userId: ${userId}</p>
            <p>token: ${resetToken}</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset link sent successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const resetPassword = async (req, res) => {
    const { resetToken } = req.params; // Retrieve reset token from route parameters
    const { newPassword } = req.body;

    try {
        // Decode the reset token to retrieve the userId
        const decodedToken = jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET);
        const userId = decodedToken.userId;

        // Define the user model based on userId pattern
        let user;
        if (userId.includes('4ps')) {
            user = await _4psModel.findOne({ userId });
        } else if (userId.includes('sen')) {
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
        user.resetToken = null;
        user.resetTokenExpiresAt = null;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: "Reset token has expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ error: "Invalid reset token" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { forgotPassword, resetPassword };
