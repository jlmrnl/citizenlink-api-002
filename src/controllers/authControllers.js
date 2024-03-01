const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const Profile = require('../models/profileSchema');

const registerUser = async (req, res) => {
    try {
        const { userId, password, name, accessLevel, accountStatus } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new profile document
        const profile = new Profile({
            name,
            accessLevel,
            accountStatus
        });
        await profile.save();

        // Create a new user document and associate it with the profile
        const user = new User({
            userId,
            password: hashedPassword,
            profile: profile._id // Associate the user with the profile
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await User.findOne({ userId }).populate('profile');
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({ 
            role: user.profile.accessLevel,
            name: user.profile.name,
            userId: user.userId
        }, 
        process.env.SECRET,
        { expiresIn: '10h' });
        
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const checkAdminRole = async (req, res) => {
        try {
            const userCount = await User.countDocuments();
            res.json({ count: userCount });
    } catch (error) {
            res.status(500).json({ message: 'Server Error' });
    }

};

const getAllUsers = async (req, res) => {
    try {
        // Query the database to get all user documents
        const users = await User.find().populate('profile');
        res.json(users); // Return the list of users as JSON response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    checkAdminRole,
    getAllUsers
};