const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        displayName: String,
        deviceToken: String, // push‑notification token (1 per user; extend to Array for multi‑device)
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: 'users' }
);

module.exports = mongoose.model('User', UserSchema);