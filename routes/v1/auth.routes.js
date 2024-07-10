const { Router } = require('express');
const auth = require('../../controllers/auth.controllers.js');
const router = Router();
const { restrict } = require('../../middlewares/auth.middleware');
const passport = require('../../libs/passport');

router.post('/register', auth.register);
router.post('/verify-otp', auth.verifyOtp);
router.post('/resend-otp', auth.resendOtp);
router.delete('/users', restrict, auth.deleteUser);

router.post('/login', auth.login);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/google',
    session: false,
  }),
  auth.googleLogin
);


router.post('/forgot-password', auth.sendResetPasswordEmail);
router.post('/reset-password', auth.resetPassword);
router.post('/change-password', restrict, auth.changePassword);
router.get('/verified', restrict, auth.verified);
router.put('/users/profile', restrict, auth.updateUserProfile);
router.get('/users/profile', restrict, auth.getUserByToken);
router.get('/users/:id', restrict, auth.getUserById);
router.get('/users', restrict, auth.getAll);

module.exports = router;
