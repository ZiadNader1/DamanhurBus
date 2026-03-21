const express = require('express');
const router = express.Router();
const {
    getGovernorates,
    createGovernorate,
    updateGovernorate,
    deleteGovernorate
} = require('../controllers/governorateController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getGovernorates)
    .post(protect, authorize('admin'), createGovernorate);

router.route('/:id')
    .put(protect, authorize('admin'), updateGovernorate)
    .delete(protect, authorize('admin'), deleteGovernorate);

module.exports = router;
