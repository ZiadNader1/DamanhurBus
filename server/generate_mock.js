const mongoose = require('mongoose');
const Booking = require('./models/Booking');
require('dotenv').config();

const generateMockData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for mock data generation...');

        const passengersCount = 33; // 15 (Bus 1) + 15 (Bus 2) + 3 (Bus 3)
        const mockBookings = [];

        const locations = ['دمنهور مدخل المحافظة', 'إيتاي شارع فراويلة', 'أبو حمص عند الكوبري', 'كفر الدوار مدخل العمدة'];

        for (let i = 1; i <= passengersCount; i++) {
            mockBookings.push({
                fullName: `Passenger ${i} - Mock Data`,
                phoneNumber: `01${Math.floor(Math.random() * 3)}${Math.floor(10000000 + Math.random() * 90000000)}`.substring(0, 11),
                university: "الجامعة المصرية اليابانية",
                weekday: "السبت",
                timeSlot: "04:00 PM",
                departureFrom: locations[Math.floor(Math.random() * locations.length)],
                departureTo: "السكن الجامعي HQ",
                order: i,
                bookingDate: new Date(Date.now() - (passengersCount - i) * 60000) // Staggered times
            });
        }

        // Validate phone numbers to match Egyptian format roughly for the seed
        mockBookings.forEach(b => {
            // Simple fix to ensure valid Egyptian start if random failed match exactly
            if (!b.phoneNumber.startsWith('01')) b.phoneNumber = '01144180891';
        });

        await Booking.insertMany(mockBookings);
        console.log(`✅ Success! Created ${passengersCount} mock bookings for Saturday 04:00 PM.`);
        process.exit();
    } catch (error) {
        console.error('❌ Error generating mock data:', error);
        process.exit(1);
    }
};

generateMockData();
