const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Connect Database Middleware for Serverless / Vercel
app.use(async (req, res, next) => {
    if (req.path === '/') return next();
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('DB Connection Error:', err);
        res.status(500).json({ success: false, message: 'Database connection error' });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bus', require('./routes/bus'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/settings', require('./routes/universitySettings'));
app.use('/api/governorates', require('./routes/governorate'));

app.get('/', (req, res) => {
    res.send('Damanhour Bus API is running...');
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    connectDB().then(async () => {
        console.log('Running auto-seed...');
        const seed = require('./seed-logic');
        await seed();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Initialization error:', err);
        process.exit(1);
    });
}

module.exports = app;
