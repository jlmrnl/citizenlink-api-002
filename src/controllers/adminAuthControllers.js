const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/LGUuserSchema');
const Profile = require('../models/LGUprofileSchema');
const Senior_records = require("../models/SeniorFormsSchema");
const _4ps_records = require('../models/_4PsFormsSchema');

let counters = {
    'reg1': 1,
    'mun2417': 1,
    'brgy30': 1,
    'brgy05': 1
};

const registerUser = async (req, res) => {
    try {
        const { firstName, middleName, lastName, suffix, accessLevel, accountStatus, barangay, password, email } = req.body;
        // Ensure email is provided and not null
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: "Email is required" });
        }

        // Check if email exists in any of the schemas
        const emailExists = await Promise.any([
            _4ps_records.exists({ email }),
            Senior_records.exists({ email }),
            Profile.exists({ email })
        ]);
        if (emailExists) {
            console.log('Email already exists'); // Log the message
            return res.status(400).json({ error: "Email already exists" });
        }

        // Determine prefix based on accessLevel and barangay
        let prefix = '';
        switch(accessLevel) {
            case 'regional':
                prefix = 'reg1-';
                break;
            case 'municipal':
                prefix = 'mun2417-';
                break;
            case 'barangay':
                if (barangay === 'San Isidro Norte') {
                    prefix = 'brgy30-';
                } else {
                    prefix = 'brgy05-';
                }
                break;
        }

        // Initialize counter if not already defined
        if (!counters[prefix]) {
            counters[prefix] = 1;
        }

        let userIdExists = true;
        let userId;

        // Keep generating unique userIds until one doesn't exist in the database
        while (userIdExists) {
            // Generate a unique identifier based on the corresponding counter for the prefix
            const uniqueIdentifier = counters[prefix].toString().padStart(5, '0');

            // Combine prefix and unique identifier to generate userId
            userId = prefix + uniqueIdentifier;

            // Check if the userId already exists in the database
            const existingUser = await User.findOne({ userId });

            if (!existingUser) {
                // If userId doesn't exist, exit the loop
                userIdExists = false;
            } else {
                // Increment the counter for the current prefix for the next registration
                counters[prefix]++;
            }
        }

        // Create a new profile document
        const profile = new Profile({
            firstName,
            middleName,
            lastName,
            suffix,
            accessLevel,
            accountStatus,
            email
        });
        await profile.save();

        // Create a new user document and associate it with the profile
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const user = new User({
            userId,
            email,
            password: hashedPassword,
            profile: profile._id, // Associate the user with the profile
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully", userId });
        console.log("userId: ", userId)
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

        let fullName = user.profile.firstName;
        if (user.profile.middleName) {
            fullName += ` ${user.profile.middleName}`;
        }
        fullName += ` ${user.profile.lastName}`;
        if (user.profile.suffix) {
            fullName += ` ${user.profile.suffix}`;
        }

        const token = jwt.sign({ 
            role: user.profile.accessLevel,
            name: fullName,
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