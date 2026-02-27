const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookings,
    updateBookingOrder,
    updateBooking,
    deleteBooking,
    deleteManyBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Public route for students to book
router.post('/', createBooking);

// Admin only route to see all bookings
router.get('/', protect, authorize('admin'), getBookings);
router.put('/reorder', protect, authorize('admin'), updateBookingOrder);
router.post('/delete-bulk', protect, authorize('admin'), deleteManyBookings);
router.route('/:id')
    .put(protect, authorize('admin'), updateBooking)
    .delete(protect, authorize('admin'), deleteBooking);

module.exports = router;
