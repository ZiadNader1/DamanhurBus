const UniversityConfig = require('./models/UniversityConfig');
const User = require('./models/User');
const Governorate = require('./models/Governorate');

const defaultDirectionalDays = [
    { id: 'sat-go', name: 'السبت ذهاب', direction: 'go', active: false, times: [] },
    { id: 'sat-return', name: 'السبت عودة', direction: 'return', active: false, times: [] },
    { id: 'sun-go', name: 'الأحد ذهاب', direction: 'go', active: false, times: [] },
    { id: 'sun-return', name: 'الأحد عودة', direction: 'return', active: false, times: [] },
    { id: 'mon-go', name: 'الاثنين ذهاب', direction: 'go', active: false, times: [] },
    { id: 'mon-return', name: 'الاثنين عودة', direction: 'return', active: false, times: [] },
    { id: 'tue-go', name: 'الثلاثاء ذهاب', direction: 'go', active: false, times: [] },
    { id: 'tue-return', name: 'الثلاثاء عودة', direction: 'return', active: false, times: [] },
    { id: 'wed-go', name: 'الأربعاء ذهاب', direction: 'go', active: false, times: [] },
    { id: 'wed-return', name: 'الأربعاء عودة', direction: 'return', active: false, times: [] },
    { id: 'thu-go', name: 'الخميس ذهاب', direction: 'go', active: false, times: [] },
    { id: 'thu-return', name: 'الخميس عودة', direction: 'return', active: false, times: [] },
    { id: 'fri-go', name: 'الجمعة ذهاب', direction: 'go', active: false, times: [] },
    { id: 'fri-return', name: 'الجمعة عودة', direction: 'return', active: false, times: [] }
];

const governorateData = [
    { name: 'البحيرة', cities: ['دمنهور', 'كفر الدوار', 'ايتاي', 'ابو حمص'] },
    { name: 'كفر الشيخ', cities: ['كفر الشيخ', 'دسوق'] },
    { name: 'طنطا', cities: ['طنطا'] },
    { name: 'بورسعيد', cities: ['بورسعيد', 'دمياط'] }
];

const generateGovConfigs = (hqDest) => {
    return [
        {
            governorateName: 'البحيرة',
            pickupLocations: [
                { name: 'دمنهور مدخل المحافظة', active: true },
                { name: 'إيتاي شارع فراويلة', active: true },
                { name: 'أبو حمص عند الكوبري', active: true },
                { name: 'كفر الدوار مدخل العمدة', active: true }
            ],
            destinations: [{ name: hqDest, active: true }],
            directionalDays: JSON.parse(JSON.stringify(defaultDirectionalDays))
        },
        {
            governorateName: 'كفر الشيخ',
            pickupLocations: [{ name: 'كفر الشيخ', active: true }, { name: 'دسوق', active: true }],
            destinations: [{ name: hqDest, active: true }],
            directionalDays: JSON.parse(JSON.stringify(defaultDirectionalDays))
        },
        {
            governorateName: 'طنطا',
            pickupLocations: [{ name: 'طنطا', active: true }],
            destinations: [{ name: hqDest, active: true }],
            directionalDays: JSON.parse(JSON.stringify(defaultDirectionalDays))
        },
        {
            governorateName: 'بورسعيد',
            pickupLocations: [{ name: 'بورسعيد', active: true }, { name: 'دمياط', active: true }],
            destinations: [{ name: hqDest, active: true }],
            directionalDays: JSON.parse(JSON.stringify(defaultDirectionalDays))
        }
    ];
};

const universityData = [
    {
        universityId: 'ejust',
        universityName: 'الجامعة المصرية اليابانية',
        governorates: generateGovConfigs('السكن الجامعي HQ')
    },
    {
        universityId: 'alamein',
        universityName: 'جامعة العلمين الدولية',
        governorates: generateGovConfigs('جامعة العلمين الدولية')
    },
    {
        universityId: 'menofia',
        universityName: 'جامعة المنوفية الأهلية',
        governorates: generateGovConfigs('السكن الجامعي HQ')
    },
    {
        universityId: 'damanhour-ahlia',
        universityName: 'جامعة دمنهور الأهلية',
        governorates: generateGovConfigs('السكن الجامعي HQ')
    }
];

module.exports = async () => {
    try {
        console.log('Seeding database...');

        // 0. Seed Governorates
        for (const govData of governorateData) {
            const exists = await Governorate.findOne({ name: govData.name });
            if (!exists) {
                await Governorate.create(govData);
                console.log(`✅ Seeded Governorate ${govData.name}`);
            } else {
                // If they incorrectly have directionalDays from the previous mistake, remove them
                if (exists.directionalDays) {
                    exists.directionalDays = undefined;
                    await exists.save();
                    console.log(`✅ Removed tracking directionalDays from Governorate ${govData.name}`);
                } else {
                    console.log(`ℹ️ Governorate ${govData.name} exists, skipping.`);
                }
            }
        }

        // 1. Seed University Configs
        for (const data of universityData) {
            const exists = await UniversityConfig.findOne({ universityId: data.universityId });
            if (!exists) {
                await UniversityConfig.create(data);
                console.log(`✅ Seeded ${data.universityId}`);
            } else {
                let changed = false;
                // If we upgraded the schema and they don't have governorates mapped, or it's empty
                if (!exists.governorates || exists.governorates.length === 0) {
                    exists.governorates = data.governorates;
                    changed = true;
                }
                // Ensure pickupLocations and destinations are removed from top level (cleanup from old schema)
                if (exists.pickupLocations) {
                    exists.pickupLocations = undefined;
                    changed = true;
                }
                if (exists.destinations) {
                    exists.destinations = undefined;
                    changed = true;
                }

                if (changed) {
                    await exists.save();
                    console.log(`✅ Migrated University ${data.universityId} to hierarchical Governorates structure!`);
                } else {
                    console.log(`ℹ️ ${data.universityId} exists with governorates, skipping.`);
                }
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
