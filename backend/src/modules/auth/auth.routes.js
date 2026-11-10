const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

router.get('/users', authController.getUsers);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.get('/me', authController.me);

module.exports = router;
