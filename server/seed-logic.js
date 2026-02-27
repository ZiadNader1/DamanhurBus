const UniversityConfig = require('./models/UniversityConfig');
const User = require('./models/User');

const universityData = [
    {
        universityId: 'ejust',
        universityName: 'الجامعة المصرية اليابانية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM'],
        availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        destination: 'السكن الجامعي HQ'
    },
    {
        universityId: 'alamein',
        universityName: 'جامعة العلمين الدولية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM'],
        availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        destination: 'السكن الجامعي HQ'
    },
    {
        universityId: 'menofia',
        universityName: 'جامعة المنوفية الأهلية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM'],
        availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        destination: 'السكن الجامعي HQ'
    },
    {
        universityId: 'damanhour-ahlia',
        universityName: 'جامعة دمنهور الأهلية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        timeSlots: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM'],
        availableDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        destination: 'السكن الجامعي HQ'
    }
];

module.exports = async () => {
    try {
        console.log('Seeding database...');

        // 1. Seed University Configs
        for (const data of universityData) {
            await UniversityConfig.findOneAndUpdate(
                { universityId: data.universityId },
                data,
                { upsert: true, new: true }
            );
        }

        // 2. Seed Admin User
        const adminEmail = 'admin@damanhourbus.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            await User.create({
                name: 'مدير النظام',
                email: adminEmail,
                password: 'admin123password',
                role: 'admin'
            });
            console.log('✅ Admin user created');
        }

        console.log('🚀 Database sync success!');
    } catch (error) {
        console.error('❌ Sync error:', error);
    }
};
