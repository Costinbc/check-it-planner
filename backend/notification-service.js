const mongoose = require('mongoose');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const Task = require('./models/Task');
const User = require('./models/User');
const schedule = require('node-schedule');

dotenv.config();

// Initialize Firebase Admin SDK for sending notifications
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Notification Service: Connected to MongoDB'))
    .catch(err => console.error('Notification Service: MongoDB connection error:', err));

// Function to send notification
async function sendNotification(userId, task) {
    try {
        // Get user's Firebase UID from our database
        const user = await User.findById(userId);

        if (!user || !user.firebaseUid) {
            console.log(`No Firebase UID found for user ${userId}`);
            return;
        }

        // Create message
        const message = {
            notification: {
                title: 'Task Reminder',
                body: task.title
            },
            data: {
                taskId: task._id.toString(),
                type: 'task_reminder'
            },
            token: user.deviceToken // Assuming user has a device token stored
        };

        // If user has a device token, send notification
        if (user.deviceToken) {
            await admin.messaging().send(message);
            console.log(`Notification sent to user ${userId} for task ${task._id}`);
        } else {
            // Fallback to email notification if implemented
            console.log(`No device token for user ${userId}, notification not sent`);
        }
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

// Schedule notifications for today
async function scheduleNotifications() {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        // Find all tasks with notifications scheduled for today that haven't been sent yet
        const tasks = await Task.find({
            notification: { $gte: now, $lte: endOfDay },
            notificationSent: { $ne: true }
        }).populate('user', 'firebaseUid deviceToken');

        console.log(`Found ${tasks.length} tasks with pending notifications`);

        // Schedule each notification
        tasks.forEach(task => {
            const notificationTime = new Date(task.notification);

            // Schedule job
            const job = schedule.scheduleJob(notificationTime, async () => {
                await sendNotification(task.user._id, task);

                // Mark notification as sent
                await Task.findByIdAndUpdate(task._id, { notificationSent: true });
            });

            console.log(`Scheduled notification for task "${task.title}" at ${notificationTime}`);
        });
    } catch (error) {
        console.error('Error scheduling notifications:', error);
    }
}

// Check for notifications every hour
schedule.scheduleJob('0 * * * *', async () => {
    console.log('Running scheduled notification check');
    await scheduleNotifications();
});

// Also run immediately on startup
scheduleNotifications();

console.log('Notification service started');

// For mobile push notifications, you would add a function to register device tokens
// This would be called when a user logs in on their mobile device
async function registerDeviceToken(userId, token) {
    try {
        await User.findByIdAndUpdate(userId, { deviceToken: token });
        console.log(`Registered device token for user ${userId}`);
        return true;
    } catch (error) {
        console.error('Error registering device token:', error);
        return false;
    }
}

// Export for API usage
module.exports = {
    registerDeviceToken
};