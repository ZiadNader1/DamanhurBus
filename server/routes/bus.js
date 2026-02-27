const express = require('express');
const router = express.Router();
const { getBuses, addBus } = require('../controllers/busController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getBuses);
router.post('/', protect, authorize('admin'), addBus);

module.exports = router;
