const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://ziad320230146_db_user:Ip4UjgPYgAGrKWdC@damanhurbus.k54cqu3.mongodb.net/?appName=damanhurbus';

async function testConn() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const count = await mongoose.connection.db.collection('universityconfigs').countDocuments();
        console.log('UniversityConfigs count:', count);

        const govCount = await mongoose.connection.db.collection('governorates').countDocuments();
        console.log('Governorates count:', govCount);

        const bookingCount = await mongoose.connection.db.collection('bookings').countDocuments();
        console.log('Bookings count:', bookingCount);

        process.exit(0);
    } catch (err) {
        console.error('Connection Error:', err);
        process.exit(1);
    }
}

testConn();
