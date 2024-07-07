const { Router } = require('express');
const auth = require('../../controllers/auth.controller.js');
const router = Router();
const {
  restrict,
  isAdmin,
  isUser,
} = require('../../middlewares/auth.middleware');

router.post('/register', auth.register);
router.post('/verify-otp', auth.verifyOtp);
router.post('/resend-otp', auth.resendOtp);
router.delete('/users', restrict, auth.deleteUser);

router.post('/login', auth.login);
router.post('/login-google', auth.LoginGoogle);

router.post('/forgot-password', auth.sendResetPasswordEmail);
router.post('/reset-password', auth.resetPassword);
router.post('/change-password', restrict, auth.changePassword);
router.get('/verified', restrict, auth.verified);
router.put('/users/profile', restrict, auth.updateUserProfile);
router.get('/users/profile', restrict, auth.getUserByToken);

// Admin
router.get('/users/:id', restrict, isAdmin, auth.getUserById);
router.get('/users', restrict, isAdmin, auth.getAll);

module.exports = router;
