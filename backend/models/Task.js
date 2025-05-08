const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: String,
        date: {
            type: Date, // date of the *occurrence* (no time component)
            required: true,
        },
        time: String, // optional HH:mm for UI convenience

        // 🔔 Notification scheduling (UTC date‑time when reminder should fire)
        notification: Date,
        notificationSent: {
            type: Boolean,
            default: false,
        },

        // ♻️ Recurrence
        recurring: {
            type: Boolean,
            default: false,
        },
        recurringType: {
            type: String,
            enum: ['daily', 'weekly', 'custom', null],
            default: null,
        },
        customRecurringInterval: Number, // e.g. every N days (only when recurringType === 'custom')

        completed: {
            type: Boolean,
            default: false,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: 'tasks' }
);

module.exports = mongoose.model('Task', TaskSchema);