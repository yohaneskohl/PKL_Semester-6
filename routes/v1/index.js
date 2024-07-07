const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authRoutes = require('./auth.routes');
const bookingRoutes = require('./booking.routes');
const flightRoutes = require('./flight.routes');
const paymentRoutes = require('./payment.routes')

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/bookings', bookingRoutes);
router.use('/api/v1/flights', flightRoutes);
router.use('/api/v1/payments', paymentRoutes);

module.exports = router;
