const UniversityConfig = require('./models/UniversityConfig');
const User = require('./models/User');

const universityData = [
    {
        universityId: 'ejust',
        universityName: 'الجامعة المصرية اليابانية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        directionalDays: [
            { id: 'sat-go', name: 'السبت ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'sat-return', name: 'السبت عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'sun-go', name: 'الأحد ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'sun-return', name: 'الأحد عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'mon-go', name: 'الاثنين ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'mon-return', name: 'الاثنين عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'tue-go', name: 'الثلاثاء ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'tue-return', name: 'الثلاثاء عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'wed-go', name: 'الأربعاء ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'wed-return', name: 'الأربعاء عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'thu-go', name: 'الخميس ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'thu-return', name: 'الخميس عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'fri-go', name: 'الجمعة ذهاب', direction: 'go', active: false, times: [] },
            { id: 'fri-return', name: 'الجمعة عودة', direction: 'return', active: false, times: [] }
        ],
        destinations: ['السكن الجامعي HQ']
    },
    {
        universityId: 'alamein',
        universityName: 'جامعة العلمين الدولية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        directionalDays: [
            { id: 'sat-go', name: 'السبت ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'sat-return', name: 'السبت عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'sun-go', name: 'الأحد ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'sun-return', name: 'الأحد عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'mon-go', name: 'الاثنين ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'mon-return', name: 'الاثنين عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'tue-go', name: 'الثلاثاء ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'tue-return', name: 'الثلاثاء عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'wed-go', name: 'الأربعاء ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'wed-return', name: 'الأربعاء عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'thu-go', name: 'الخميس ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'thu-return', name: 'الخميس عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'fri-go', name: 'الجمعة ذهاب', direction: 'go', active: false, times: [] },
            { id: 'fri-return', name: 'الجمعة عودة', direction: 'return', active: false, times: [] }
        ],
        destinations: ['جامعة العلمين الدولية']
    },
    {
        universityId: 'menofia',
        universityName: 'جامعة المنوفية الأهلية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        directionalDays: [
            { id: 'sat-go', name: 'السبت ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'sat-return', name: 'السبت عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'sun-go', name: 'الأحد ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'sun-return', name: 'الأحد عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'mon-go', name: 'الاثنين ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'mon-return', name: 'الاثنين عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'tue-go', name: 'الثلاثاء ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'tue-return', name: 'الثلاثاء عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'wed-go', name: 'الأربعاء ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'wed-return', name: 'الأربعاء عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'thu-go', name: 'الخميس ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'thu-return', name: 'الخميس عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'fri-go', name: 'الجمعة ذهاب', direction: 'go', active: false, times: [] },
            { id: 'fri-return', name: 'الجمعة عودة', direction: 'return', active: false, times: [] }
        ],
        destinations: ['السكن الجامعي HQ']
    },
    {
        universityId: 'damanhour-ahlia',
        universityName: 'جامعة دمنهور الأهلية',
        pickupLocations: ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'],
        directionalDays: [
            { id: 'sat-go', name: 'السبت ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'sat-return', name: 'السبت عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'sun-go', name: 'الأحد ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'sun-return', name: 'الأحد عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'mon-go', name: 'الاثنين ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'mon-return', name: 'الاثنين عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'tue-go', name: 'الثلاثاء ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'tue-return', name: 'الثلاثاء عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'wed-go', name: 'الأربعاء ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'wed-return', name: 'الأربعاء عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'thu-go', name: 'الخميس ذهاب', direction: 'go', active: true, times: ['07:30 AM', '08:30 AM'] },
            { id: 'thu-return', name: 'الخميس عودة', direction: 'return', active: true, times: ['04:00 PM', '05:00 PM'] },
            { id: 'fri-go', name: 'الجمعة ذهاب', direction: 'go', active: false, times: [] },
            { id: 'fri-return', name: 'الجمعة عودة', direction: 'return', active: false, times: [] }
        ],
        destinations: ['السكن الجامعي HQ']
    }
];

module.exports = async () => {
    try {
        console.log('Seeding database...');

        // 1. Seed University Configs
        for (const data of universityData) {
            const exists = await UniversityConfig.findOne({ universityId: data.universityId });
            if (!exists) {
                await UniversityConfig.create(data);
                console.log(`✅ Seeded ${data.universityId}`);
            } else {
                console.log(`ℹ️ ${data.universityId} exists, skipping sync to maintain persistence.`);
            }
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
