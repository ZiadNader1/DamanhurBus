const mongoose = require('mongoose');

const governorateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a governorate name'],
        unique: true,
        trim: true
    },
    cities: {
        type: [String],
        default: []
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
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Governorate', governorateSchema);
