const mongoose = require('mongoose');
const UniversityConfig = require('./models/UniversityConfig');
require('dotenv').config();

const seedData = [
    {
        universityId: 'ejust',
        universityName: 'الجامعة المصرية اليابانية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM']
    },
    {
        universityId: 'alamein',
        universityName: 'جامعة العلمين الدولية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM']
    },
    {
        universityId: 'menofia',
        universityName: 'جامعة المنوفية الأهلية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM']
    },
    {
        universityId: 'damanhour-ahlia',
        universityName: 'جامعة دمنهور الأهلية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM']
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const data of seedData) {
            await UniversityConfig.findOneAndUpdate(
                { universityId: data.universityId },
                data,
                { upsert: true, new: true }
            );
        }

        console.log('Data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();
