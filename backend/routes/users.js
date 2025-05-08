const express2 = require('express');
const userRouter = express2.Router();
const User = require('../models/User');

// POST /api/users/device-token – save or update push‑notification token
authorizationRequired = async (req, res, next) => next(); // placeholder if mounted under auth
userRouter.post('/device-token', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: 'token is required' });
        const user = await User.findByIdAndUpdate(req.user.id, { deviceToken: token }, { new: true });
        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = userRouter;