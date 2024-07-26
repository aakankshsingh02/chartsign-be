const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// Verify token route
router.get('/api/reset/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() } // Check token is not expired
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired' });
        }
        
        res.status(200).json({ success: true, message: 'Token is valid', userIdentifier: user.username || user.email });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Reset password route
router.post('/api/reset/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired' });
        }

        if (!req.body.password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }

        // Update the user's password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password has been reset' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;