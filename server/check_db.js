const mongoose = require('mongoose');
const UniversityConfig = require('./models/UniversityConfig');
require('dotenv').config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const configs = await UniversityConfig.find({});
        console.log(JSON.stringify(configs, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDB();
