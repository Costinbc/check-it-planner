const schedule = require('node-schedule');
const Task = require('../models/Task');
const { addDays } = require('date-fns');
const mongoose2 = require('mongoose');

// Only start when this module is imported *after* mongoose connection is ready
function getNextDateForTask(t) {
    switch (t.recurringType) {
        case 'daily':
            return addDays(t.date, 1);
        case 'weekly':
            return addDays(t.date, 7);
        case 'custom':
            return addDays(t.date, t.customRecurringInterval || 1);
        default:
            return null;
    }
}

async function createUpcomingOccurrences() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Find recurring tasks whose next occurrence would be tomorrow and does not yet exist
    const tasks = await Task.find({ recurring: true, date: { $lte: today } });
    for (const t of tasks) {
        const nextDate = getNextDateForTask(t);
        const exists = await Task.exists({ user: t.user, title: t.title, date: nextDate });
        if (!exists) {
            await Task.create({
                ...t.toObject(),
                _id: undefined,
                date: nextDate,
                completed: false,
                notificationSent: false,
                createdAt: new Date(),
            });
        }
    }
}

// Run every day at 00:05
schedule.scheduleJob('5 0 * * *', createUpcomingOccurrences);

module.exports = { createUpcomingOccurrences };
