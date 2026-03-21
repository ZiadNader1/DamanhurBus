const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const countBahira = await Booking.countDocuments({ governorate: 'البحيرة' });
    const countKaf = await Booking.countDocuments({ governorate: 'كفر الشيخ' });
    const countTanta = await Booking.countDocuments({ governorate: 'طنطا' });
    const countPort = await Booking.countDocuments({ governorate: 'بورسعيد' });
    const total = await Booking.countDocuments();

    console.log(`Summary:`);
    console.log(`- Total Bookings: ${total}`);
    console.log(`- البحيرة: ${countBahira}`);
    console.log(`- كفر الشيخ: ${countKaf}`);
    console.log(`- طنطا: ${countTanta}`);
    console.log(`- بورسعيد: ${countPort}`);
    
    process.exit(0);
}

check();
