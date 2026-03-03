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
    directionalDays: {
        type: [new mongoose.Schema({
            id: String,
            name: String,
            direction: { type: String, enum: ['go', 'return'] },
            active: { type: Boolean, default: false },
            times: { type: [String], default: [] }
        }, { _id: false })],
        default: []
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
