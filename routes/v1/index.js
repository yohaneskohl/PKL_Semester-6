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

const swaggerUI = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

const swagger_path = path.resolve(__dirname, '../../docs/v1.yaml');
const customCssUrl =
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css';
const customJs = [
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
];

const file = fs.readFileSync(swagger_path, 'utf-8');

const swaggerDocument = yaml.parse(file);

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/bookings', bookingRoutes);
router.use('/api/v1/flights', flightRoutes);
router.use('/api/v1/payments', paymentRoutes);
router.use('/api/v1/airlines', airlineRoutes);
router.use('/api/v1/notifications', notificationRoutes);
router.use('/api/v1/tickets', ticketRoutes);
router.use('/api/v1/cities', cityRoutes);

module.exports = router;
