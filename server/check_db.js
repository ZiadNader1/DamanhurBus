const mongoose = require('mongoose');
const Booking = require('./models/Booking');
require('dotenv').config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const satFri = await Booking.find({
            weekday: { $in: ['السبت', 'الجمعة', 'Saturday', 'Friday'] },
            departureTo: { $regex: 'البحيرة|Beheira', $options: 'i' }
        });
        console.log("Remaining Sat/Fri Beheira bookings:", satFri.length);
        console.log(satFri);
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDB();
