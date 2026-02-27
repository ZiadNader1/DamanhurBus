const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect Database
connectDB().then(async () => {
    console.log('Running auto-seed...');
    const seed = require('./seed-logic');
    await seed();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bus', require('./routes/bus'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/settings', require('./routes/universitySettings'));

app.get('/', (req, res) => {
    res.send('Damanhour Bus API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
