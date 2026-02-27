const UniversityConfig = require('../models/UniversityConfig');

// @desc    Get all university configs
// @route   GET /api/settings
// @access  Public
exports.getAllSettings = async (req, res) => {
    try {
        const configs = await UniversityConfig.find();
        res.status(200).json({
            success: true,
            data: configs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single university config
// @route   GET /api/settings/:universityId
// @access  Public
exports.getUniversitySettings = async (req, res) => {
    try {
        const config = await UniversityConfig.findOne({ universityId: req.params.universityId });
        if (!config) {
            return res.status(404).json({ success: false, message: 'Settings not found' });
        }
        res.status(200).json({
            success: true,
            data: config
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update university config (Admin only)
// @route   PUT /api/settings/:universityId
// @access  Private (Admin)
exports.updateUniversitySettings = async (req, res) => {
    try {
        console.log(`Updating settings for: ${req.params.universityId}`);
        console.log('Update Payload:', JSON.stringify(req.body, null, 2));

        const {
            universityName,
            pickupLocations,
            timeSlots,
            availableDays,
            destination
        } = req.body;

        const updateData = {
            universityName,
            pickupLocations,
            timeSlots,
            availableDays,
            destination,
            updatedAt: Date.now()
        };

        const config = await UniversityConfig.findOneAndUpdate(
            { universityId: req.params.universityId },
            updateData,
            {
                new: true,
                runValidators: true,
                upsert: true,
                returnDocument: 'after'
            }
        );

        console.log('Settings updated successfully');

        res.status(200).json({
            success: true,
            data: config
        });
    } catch (error) {
        console.error('Update Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
