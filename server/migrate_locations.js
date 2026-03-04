const mongoose = require('mongoose');
const UniversityConfig = require('./models/UniversityConfig');
require('dotenv').config();

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const configs = await UniversityConfig.find({});

        for (const config of configs) {
            let updated = false;

            // Migrate pickupLocations
            if (config.pickupLocations && config.pickupLocations.length > 0 && typeof config.pickupLocations[0] === 'string') {
                config.pickupLocations = config.pickupLocations.map(name => ({ name, active: true }));
                updated = true;
            }

            // Migrate destinations
            if (config.destinations && config.destinations.length > 0 && typeof config.destinations[0] === 'string') {
                config.destinations = config.destinations.map(name => ({ name, active: true }));
                updated = true;
            }

            if (updated) {
                await config.save();
                console.log(`Migrated ${config.universityName}`);
            }
        }

        console.log('Migration complete');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
