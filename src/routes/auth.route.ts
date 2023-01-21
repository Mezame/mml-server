import express from 'express';
import { logout } from '../controllers/auth/logout.controller.js';
import login from '../controllers/auth/login.controller.js';
import checkCsrfToken from '../middlewares/csrf.middleware.js';
import checkIfAuthenticated from '../middlewares/auth.middleware.js';
import getUserIdFromToken from '../middlewares/user-token.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', getUserIdFromToken, checkIfAuthenticated, checkCsrfToken, logout);

export default router;
