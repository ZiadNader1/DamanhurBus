const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const bookings = await Booking.find().sort({ _id: -1 }).limit(10);
    console.log('Last 10 bookings details:');
    bookings.forEach(b => {
        console.log(`- ID: ${b._id}`);
        console.log(`  Name: "${b.fullName}" (len: ${b.fullName?.length})`);
        console.log(`  Gov:  "${b.governorate}" (len: ${b.governorate?.length})`);
        console.log(`  Uni:  "${b.university}" (len: ${b.university?.length})`);
    });
    process.exit(0);
}

check();
