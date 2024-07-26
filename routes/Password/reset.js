const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.post('/api/reset/:token', async (req, res) => {
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired' });
        }

        user.setPassword(password, async (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error resetting password', error: err.message });
            }

            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            res.status(200).json({ success: true, message: 'Password has been reset successfully' });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;
