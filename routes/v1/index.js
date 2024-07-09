const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authRoutes = require('./auth.routes');
const bookingRoutes = require('./booking.routes');
const flightRoutes = require('./flight.routes');
const paymentRoutes = require('./payment.routes')
const airlineRoutes = require('./airline.routes');
const notificationRoutes = require('./notification.routes')
const ticketRoutes = require('./ticket.routes');
const cityRoutes = require('./city.routes');

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/bookings', bookingRoutes);
router.use('/api/v1/flights', flightRoutes);
router.use('/api/v1/payments', paymentRoutes);
router.use('/api/v1/airlines', airlineRoutes);
router.use('/api/v1/notifications', notificationRoutes);
router.use('/api/v1/tickets', ticketRoutes);
router.use('/api/v1/cities', cityRoutes);

module.exports = router;
