const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true,
    },
    departureTime: {
        type: Date,
        required: true,
    },
    arrivalTime: {
        type: Date,
        required: true,
    },
    origin: {
        type: String,
        default: 'Damanhour',
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    availableSeats: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Schedule', scheduleSchema);
