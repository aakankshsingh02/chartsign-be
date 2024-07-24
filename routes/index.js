const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ success: false, message: 'Server error' });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        
        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Server error' });
            res.status(200).json({ success: true, message: 'Logged in successfully' });
        });
    })(req, res, next);
});

module.exports = router;