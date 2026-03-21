const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');
const Governorate = require('./models/Governorate');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const govs = await Governorate.find();
        const bookings = await Booking.find({ governorate: { $exists: false } });

        console.log(`Found ${bookings.length} bookings to migrate.`);

        for (const booking of bookings) {
            let foundGov = 'البحيرة'; // Default or fallback
            
            // Try to match departureFrom or departureTo with city names
            for (const gov of govs) {
                const isMatch = gov.cities.some(city => 
                    booking.departureFrom.includes(city) || 
                    booking.departureTo.includes(city)
                );
                if (isMatch) {
                    foundGov = gov.name;
                    break;
                }
            }

            booking.governorate = foundGov;
            await booking.save();
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
