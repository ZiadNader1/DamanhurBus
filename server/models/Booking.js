const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide your full name'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide your phone number'],
        match: [/^(01)[0-2,5]{1}[0-9]{8}$/, 'Please provide a valid Egyptian phone number'],
    },
    university: {
        type: String,
        required: [true, 'Please select your university'],
    },
    weekday: {
        type: String,
        required: [true, 'Please select a weekday'],
    },
    timeSlot: {
        type: String,
        required: [true, 'Please select a time slot'],
    },
    departureFrom: {
        type: String,
        required: [true, 'Please select departure point'],
    },
    departureTo: {
        type: String,
        required: [true, 'Please select destination'],
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    order: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
