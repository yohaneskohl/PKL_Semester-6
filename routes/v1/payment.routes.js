const router = require('express').Router();
const {
  confirmPayment,
  createPaymentMidtransHandler
} = require('../../controllers/payment.controllers');
const { restrict } = require('../../middlewares/auth.middleware');

router.post('/midtrans/confirm', confirmPayment);
router.post('/midtrans/:bookingId', restrict, createPaymentMidtransHandler);

module.exports = router