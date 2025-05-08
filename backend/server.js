const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const authMiddleware = require('./middleware/auth');

dotenv.config();
const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Routes ----------
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/users', authMiddleware, userRoutes);

// ---------- DB & Server ----------
mongoose
    .connect(process.env.MONGODB_URI, {
        autoIndex: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
        // Lazy‑load recurring‑service *after* connection established
        require('./services/recurring-service');
    })
    .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));