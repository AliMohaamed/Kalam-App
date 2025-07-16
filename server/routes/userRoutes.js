import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


// The request will only reach 'getUsers' if the token is valid.
router.route('/').get(protect, getUsers);

export default router;