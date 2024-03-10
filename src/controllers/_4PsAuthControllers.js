const bcrypt = require("bcrypt");
const userModel = require("../models/_4psUserSchema");
const jwt = require("jsonwebtoken");
const seniorModel = require("../models/seniorUserSchema");
const SeniorFormsModel = require("../models/SeniorFormsSchema");

const login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ userId }).populate("records");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        name: user.name,
        firstname: user.records.firstname,
        lastname: user.records.surname,
        middlename: user.records.middlename,
        suffix: user.records.suffix,
        role: user.role,
        applicationStatus: user.records.applicationStatus,
        barangay: user.records.barangay,
        user_id: user._id,
        records_id: user.records._id,
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
      userModel.find().populate("records"),
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

// Export both login and getAllUsers functions
module.exports = { login, getAllUsers };
