const express = require('express');
const router = express.Router();
const {
    getAllSettings,
    getUniversitySettings,
    updateUniversitySettings
} = require('../controllers/universitySettingsController');
const { protect, authorize } = require('../middleware/auth');

// Public routes for the booking form
router.get('/', getAllSettings);
router.get('/:universityId', getUniversitySettings);

// Admin routes for the dashboard
router.put('/:universityId', protect, authorize('admin'), updateUniversitySettings);

module.exports = router;
