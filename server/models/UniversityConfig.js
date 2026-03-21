const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    active: { type: Boolean, default: true }
}, { _id: false });

const DayTimeSchema = new mongoose.Schema({
    id: String,
    name: String,
    direction: { type: String, enum: ['go', 'return'] },
    active: { type: Boolean, default: false },
    times: { type: [String], default: [] }
}, { _id: false });

const GovernorateConfigSchema = new mongoose.Schema({
    governorateName: String,
    pickupLocations: {
        type: [LocationSchema],
        default: []
    },
    destinations: {
        type: [LocationSchema],
        default: []
    },
    directionalDays: {
        type: [DayTimeSchema],
        default: []
    }
}, { _id: false });

const universityConfigSchema = new mongoose.Schema({
    universityId: {
        type: String,
        required: true,
        unique: true
    },
    universityName: {
        type: String,
        required: true
    },
    governorates: {
        type: [GovernorateConfigSchema],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('UniversityConfig', universityConfigSchema);
