const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { addDays } = require('date-fns');

// Helper: generate next occurrence date for a recurring task
function getNextDate(task) {
    if (!task.recurring) return null;
    const current = task.date;
    switch (task.recurringType) {
        case 'daily':
            return addDays(current, 1);
        case 'weekly':
            return addDays(current, 7);
        case 'custom':
            return addDays(current, task.customRecurringInterval || 1);
        default:
            return null;
    }
}

// GET /api/tasks?date=YYYY-MM-DD – tasks for the given day (default: all)
router.get('/', async (req, res) => {
    try {
        const { date } = req.query;
        const query = { user: req.user.id };

        if (date) {
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);
            query.date = { $gte: dayStart, $lte: dayEnd };
        }

        const tasks = await Task.find(query).sort({ date: 1, time: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/tasks – create a task
router.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            time,
            notification,
            recurring = false,
            recurringType = null,
            customRecurringInterval = null,
        } = req.body;

        const task = await Task.create({
            user: req.user.id,
            title,
            description,
            date: new Date(date),
            time,
            notification,
            recurring,
            recurringType,
            customRecurringInterval,
        });

        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/tasks/:id – generic update (title, etc.)
router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        Object.assign(task, req.body);
        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/tasks/complete/:id – toggle complete & create next occurrence if recurring
router.patch('/complete/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.completed = !task.completed;
        await task.save();

        // Auto‑generate next occurrence when marking COMPLETE
        if (task.completed && task.recurring) {
            const nextDate = getNextDate(task);
            if (nextDate) {
                await Task.create({
                    ...task.toObject(),
                    _id: undefined,
                    date: nextDate,
                    completed: false,
                    notificationSent: false,
                    createdAt: new Date(),
                });
            }
        }

        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
