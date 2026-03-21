const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const bookings = await Booking.find().sort({ _id: -1 }).limit(10);
    console.log('Last 10 bookings:');
    bookings.forEach(b => {
        console.log(`- ID: ${b._id}, Name: ${b.fullName}, Gov: "${b.governorate}"`);
    });
    process.exit(0);
}

check();
