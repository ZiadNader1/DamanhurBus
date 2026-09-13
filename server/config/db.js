const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://innovagatedamanhour_db_user:gPobd185bEGORaf2@cluster0.pzhg1vw.mongodb.net/?retryWrites=true&w=majority';
    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
