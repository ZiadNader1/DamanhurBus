const Booking = require('../models/Booking');

// @desc    Create new guest booking
// @route   POST /api/booking
// @access  Public
exports.createBooking = async (req, res) => {
    try {
        const {
            fullName,
            phoneNumber,
            university,
            weekday,
            timeSlot,
            departureFrom,
            departureTo
        } = req.body;

        const booking = await Booking.create({
            fullName,
            phoneNumber,
            university,
            weekday,
            timeSlot,
            departureFrom,
            departureTo
        });

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/booking
// @access  Private (Admin)
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ order: 1, bookingDate: -1 });
        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// @desc    Update booking orders (Admin only)
// @route   PUT /api/booking/reorder
// @access  Private (Admin)
exports.updateBookingOrder = async (req, res) => {
    try {
        const { orders } = req.body; // Array of { id, order }

        const updates = orders.map(item =>
            Booking.findByIdAndUpdate(item.id, { order: item.order })
        );

        await Promise.all(updates);

        res.status(200).json({
            success: true,
            message: 'Order updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update a specific booking (Admin only)
// @route   PUT /api/booking/:id
// @access  Private (Admin)
exports.updateBooking = async (req, res) => {
    try {
        const { timeSlot, weekday, departureFrom, bookingDate } = req.body;

        const updateFields = { timeSlot, weekday, departureFrom };
        if (bookingDate) updateFields.bookingDate = new Date(bookingDate);

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete a specific booking (Admin only)
// @route   DELETE /api/booking/:id
// @access  Private (Admin)
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Bulk delete bookings based on filters (Admin only)
// @route   POST /api/booking/delete-bulk
// @access  Private (Admin)
exports.deleteManyBookings = async (req, res) => {
    try {
        const { university, weekday } = req.body;
        const filter = {};
        if (university && university !== 'all') filter.university = university;
        if (weekday && weekday !== 'all') filter.weekday = weekday;

        const result = await Booking.deleteMany(filter);
        res.status(200).json({ success: true, count: result.deletedCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
