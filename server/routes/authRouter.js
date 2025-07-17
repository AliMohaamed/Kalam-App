import express from 'express';
import passport from 'passport';
// Import the controller functions
import { googleCallback, logoutUser } from '../controllers/authController.js';

const router = express.Router();

// @route   GET /api/auth/google
// Kicks off the Google OAuth authentication process.
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /api/auth/google/callback
// Handles the callback from Google and calls our controller function.
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL }),
  googleCallback // <-- Use the imported controller function here
);

// @route   GET /api/auth/logout
// Handles user logout.
router.get('/logout', logoutUser); // <-- Use the imported controller function here

export default router;