const mongoose = require('mongoose');
require('dotenv').config();
const UniversityConfig = require('./models/UniversityConfig');

async function checkSettings() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const configs = await UniversityConfig.find();
        console.log('Current Settings in DB:');
        configs.forEach(c => {
            console.log(`University: ${c.universityName} (${c.universityId})`);
            console.log(`Days: ${c.availableDays.join(', ')}`);
            console.log(`Times: ${c.timeSlots.join(', ')}`);
            console.log('---');
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSettings();
