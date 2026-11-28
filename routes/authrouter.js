const express = require('express');
const { registrationController,loginController,verifyEmailController, forgotPassword, resetPassword, resendVerificationEmail } = require('../controllers/authController');
const _ = express.Router();


/**
 * @swagger
 * /api/v1/auth/registration:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and sends an email verification link.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - confirmPassword
 *               - terms
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *               terms:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registration Done
 *       400:
 *         description: Registration validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email already exist
 */
_.post('/registration',registrationController)
_.post('/login',loginController)
_.post('/verify/:token',verifyEmailController)
_.post('/forgot-password',forgotPassword)
_.post('/reset-password/:token',resetPassword)
_.post('/resend/verify/:email',resendVerificationEmail)

module.exports = _