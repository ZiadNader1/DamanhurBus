const Governorate = require('../models/Governorate');

// @desc    Get all governorates
// @route   GET /api/governorates
// @access  Public
exports.getGovernorates = async (req, res) => {
    try {
        const governorates = await Governorate.find().sort({ name: 1 });
        res.status(200).json({ success: true, count: governorates.length, data: governorates });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new governorate
// @route   POST /api/governorates
// @access  Private/Admin
exports.createGovernorate = async (req, res) => {
    try {
        const governorate = await Governorate.create(req.body);
        res.status(201).json({ success: true, data: governorate });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Governorate already exists' });
        }
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update governorate (e.g., adding/removing cities)
// @route   PUT /api/governorates/:id
// @access  Private/Admin
exports.updateGovernorate = async (req, res) => {
    try {
        const governorate = await Governorate.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!governorate) {
            return res.status(404).json({ success: false, message: 'Governorate not found' });
        }

        res.status(200).json({ success: true, data: governorate });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete governorate
// @route   DELETE /api/governorates/:id
// @access  Private/Admin
exports.deleteGovernorate = async (req, res) => {
    try {
        const governorate = await Governorate.findByIdAndDelete(req.params.id);

        if (!governorate) {
            return res.status(404).json({ success: false, message: 'Governorate not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
