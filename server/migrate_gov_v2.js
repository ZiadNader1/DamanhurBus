const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');
const Governorate = require('./models/Governorate');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const govs = await Governorate.find();
        const bookings = await Booking.find();

        console.log(`Checking ${bookings.length} bookings...`);

        let count = 0;
        for (const booking of bookings) {
            if (!booking.governorate || booking.governorate === 'undefined' || booking.governorate === '') {
                let foundGov = 'البحيرة'; // Default
                
                for (const gov of govs) {
                    const isMatch = gov.cities.some(city => 
                        (booking.departureFrom && booking.departureFrom.includes(city)) || 
                        (booking.departureTo && booking.departureTo.includes(city))
                    );
                    if (isMatch) {
                        foundGov = gov.name;
                        break;
                    }
                }

                booking.governorate = foundGov;
                await booking.save();
                count++;
            }
        }

        console.log(`Migration completed. Updated ${count} bookings.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
