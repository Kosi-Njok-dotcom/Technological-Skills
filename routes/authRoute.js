const express = require('express');
const router = express.Router();

const { register, login, verifyEmail, logout, resendVerification, resetPassword, forgottenPassword } = require('../controllers/authController');
const  { authenticate, authorizeAdmin } = require('../Middleware/auth');

router.get('/verify-email/:token', verifyEmail) 
router.post('/register', register);
router.post('/forgottenPassword', forgottenPassword);
router.post('/resend-verification', resendVerification);
router.post('/login', login);
router.post('/logout', logout);
router.get('/users', authenticate, authorizeAdmin);
router.post('/resetPassword/:token', resetPassword);


module.exports = router;