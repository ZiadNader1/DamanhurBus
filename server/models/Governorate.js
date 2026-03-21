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
