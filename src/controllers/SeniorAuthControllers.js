const bcrypt = require('bcrypt');
const userModel = require('../models/seniorUserSchema');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ userId }).populate('records');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let fullName = user.records.firstName;
        if (user.records.middleName) {
            fullName += ` ${user.records.middleName}`;
        }
        fullName += ` ${user.records.lastName}`;
        if (user.records.suffix) {
            fullName += ` ${user.records.suffix}`;
        }

    // Generate JWT token
    const token = jwt.sign({ 
        userId: user.userId,
        firstname: user.records.firstName,
        lastname: user.records.lastName,
        name: fullName,
        role: user.role,
        applicationStatus: user.records.applicationStatus,
        barangay: user.records.barangay
    }, 
    process.env.SECRET, 
    { expiresIn: '10h' });

    // Return token to the client
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { login };
