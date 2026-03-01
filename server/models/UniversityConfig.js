const mongoose = require('mongoose');

const universityConfigSchema = new mongoose.Schema({
    universityId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    universityName: {
        type: String,
        required: true,
        trim: true
    },
    pickupLocations: {
        type: [String],
        default: [
            'دمنهور مدخل المحافظة',
            'إيتاي شارع فراويلة',
            'أبو حمص عند الكوبري',
            'كفر الدوار مدخل العمدة'
        ]
    },
    timeSlots: {
        type: [String],
        default: ['07:30 AM', '08:30 AM', '04:00 PM', '05:00 PM']
    },
    availableDays: {
        type: [String],
        default: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
    },
    destinations: {
        type: [String],
        default: ['السكن الجامعي HQ']
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UniversityConfig', universityConfigSchema);
