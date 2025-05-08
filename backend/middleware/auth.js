const admin = require('firebase-admin');
const User = require('../models/User');

// Initialize Firebase Admin SDK **once** for the whole app
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });
}

// 🔐 Verifies Firebase ID token, ensures local User exists, attaches to req
module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) return res.status(401).json({ message: 'No authentication token provided' });

        // Verify & decode Firebase token
        const decoded = await admin.auth().verifyIdToken(token);
        const { uid: firebaseUid, email, name: displayName } = decoded;

        // Ensure a corresponding User document exists ("upsert")
        let user = await User.findOne({ firebaseUid });
        if (!user) {
            user = await User.create({ firebaseUid, email, displayName });
        }

        // Attach to request (⚠️ NOTE: _id is a Mongo ObjectId, not the Firebase UID)
        req.user = { id: user._id.toString(), firebaseUid, email };
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(401).json({ message: 'Authentication failed' });
    }
};
