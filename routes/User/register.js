const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.post('/api/register', async (req, res) => {
    const { username, password, email, role, name, designation } = req.body;

    if (!username || !password || !email || !name) {
        return res.status(400).json({ success: false, message: 'Username, password, email, and name are required' });
    }

    if (role && role !== 'user' && role !== 'admin') {
        return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    try {
        const user = new User({
            username,
            email,
            role: role || 'user', // Default role to 'user' if not provided
            name,
            designation: designation || '' // Default designation to empty string if not provided
        });
        await User.register(user, password);
        res.status(200).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
