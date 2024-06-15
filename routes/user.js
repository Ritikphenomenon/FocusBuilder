const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require("../db");
const { authenticateJwt, SECRET } = require("../middleware/index");

const router = express.Router();

// User signup
router.post('/signup', async (req, res) => {
    try {
        const { username, password, name, profilePhoto } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists, please choose a different one' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const newUser = new User({ username, password: hashedPassword, name, profilePhoto });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully, please login' });
    } catch (error) {
        console.error('Error during User signup:', error);
        res.status(500).json({ message: 'Server error during User signup' });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token for the user
        const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1d' });
        
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Server error during user login' });
    }
});

// Get user profile
router.get('/profile', authenticateJwt, async (req, res) => {
    try {
        const { username } = req.user;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return profile details
        res.json({ name: user.name, profilePhoto: user.profilePhoto });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error while fetching user profile' });
    }
});

module.exports = router;
