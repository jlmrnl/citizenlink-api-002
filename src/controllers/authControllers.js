const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

const registerUser = async (req, res) => {
    try {
        const { userId, password, name, accessLevel,  accountStatus} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ 
            userId,  
            name, 
            accessLevel,  
            accountStatus,
            password: hashedPassword
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
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({ 
            user: user
        }, 
        process.env.SECRET,
        { expiresIn: '10h' }); // Token expires in 10 hours
        
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

module.exports = {
    registerUser,
    loginUser,
    checkAdminRole
};