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
        type: [{
            name: { type: String, trim: true },
            active: { type: Boolean, default: true }
        }],
        default: [
            { name: 'دمنهور مدخل المحافظة', active: true },
            { name: 'إيتاي شارع فراويلة', active: true },
            { name: 'أبو حمص عند الكوبري', active: true },
            { name: 'كفر الدوار مدخل العمدة', active: true }
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
        type: [{
            name: { type: String, trim: true },
            active: { type: Boolean, default: true }
        }],
        default: [{ name: 'السكن الجامعي HQ', active: true }]
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UniversityConfig', universityConfigSchema);
