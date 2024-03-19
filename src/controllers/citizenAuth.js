const bcrypt = require("bcrypt");
const _4psModel = require("../models/_4psUserSchema");
const jwt = require("jsonwebtoken");
const seniorModel = require("../models/seniorUserSchema");

const changePassword = async (req, res) => {
    try {
      const userId = req.userId; // userId obtained from the token via middleware
  
      const { currentPassword, newPassword } = req.body;
  
      // Find the user by userId
      const user = await Promise.race([
        _4psModel.findOne({ userId }),
        seniorModel.findOne({ userId })
    ]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Compare current password with the one stored in the database
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect current password' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error(error);
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Token has expired' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  module.exports = { changePassword };