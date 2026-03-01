const mongoose = require('mongoose');
const UniversityConfig = require('./models/UniversityConfig');
const User = require('./models/User');
require('dotenv').config();

const universityData = [
    {
        universityId: 'ejust',
        universityName: 'الجامعة المصرية اليابانية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM'],
        availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        destinations: ['السكن الجامعي HQ']
    },
    {
        universityId: 'alamein',
        universityName: 'جامعة العلمين الدولية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM'],
        availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        destinations: ['السكن الجامعي HQ']
    },
    {
        universityId: 'menofia',
        universityName: 'جامعة المنوفية الأهلية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM'],
        availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        destinations: ['السكن الجامعي HQ']
    },
    {
        universityId: 'damanhour-ahlia',
        universityName: 'جامعة دمنهور الأهلية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM'],
        availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        destinations: ['السكن الجامعي HQ']
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas ☁️');

        // 1. Seed University Configs
        console.log('Seeding university configurations...');
        for (const data of universityData) {
            await UniversityConfig.findOneAndUpdate(
                { universityId: data.universityId },
                data,
                { upsert: true, new: true }
            );
        }

        // 2. Seed Admin User
        console.log('Seeding admin user...');
        const adminEmail = 'admin@damanhourbus.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            await User.create({
                name: 'مدير النظام',
                email: adminEmail,
                password: 'admin123password', // Default password
                role: 'admin'
            });
            console.log('✅ Admin user created:');
            console.log(`Email: ${adminEmail}`);
            console.log('Password: admin123password');
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

        console.log('🚀 Database seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();
