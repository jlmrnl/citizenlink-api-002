const bcrypt = require("bcrypt");
const _4psModel = require("../models/_4psUserSchema");
const jwt = require("jsonwebtoken");
const seniorModel = require("../models/seniorUserSchema");

const login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check if the user exists
    const user = await _4psModel.findOne({ userId }).populate("records");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let fullName = user.records.firstname;
        if (user.records.middlename) {
            fullName += ` ${user.records.middlename}`;
        }
        fullName += ` ${user.records.surname}`;
        if (user.records.suffix) {
            fullName += ` ${user.records.suffix}`;
        }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        firstname: user.records.firstname,
        lastname: user.records.surname,
        name: fullName,
        role: user.role,
        applicationStatus: user.records.applicationStatus,
        barangay: user.records.barangay
      },
      process.env.SECRET,
      { expiresIn: "10h" }
    );

    // Return token to the client
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Define getAllUsers controller function
const getAllUsers = async (req, res) => {
  try {
    const [users, seniorUsers] = await Promise.all([
      _4psModel.find().populate("records"),
      seniorModel.find().populate("records"),
    ]);

    // Combine users and seniorUsers into a single array
    const allUsers = [...users, ...seniorUsers];

    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { login, getAllUsers };
