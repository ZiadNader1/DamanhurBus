const Bus = require('../models/Bus');

// @desc    Get all buses
// @route   GET /api/bus
// @access  Public
exports.getBuses = async (req, res) => {
    try {
        const buses = await Bus.find();
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new bus
// @route   POST /api/bus
// @access  Admin
exports.addBus = async (req, res) => {
    try {
        const { busNumber, capacity, model, owner } = req.body;
        const bus = await Bus.create({
            busNumber,
            capacity,
            model,
            owner,
        });

        res.status(201).json(bus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
