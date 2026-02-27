const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: [true, 'Please provide a bus number'],
        unique: true,
    },
    capacity: {
        type: Number,
        required: [true, 'Please provide the capacity of the bus'],
    },
    model: {
        type: String,
        required: [true, 'Please provide the bus model'],
    },
    owner: {
        type: String,
        required: [true, 'Please provide the owner of the bus'],
    },
    active: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('Bus', busSchema);
