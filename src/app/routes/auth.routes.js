import express from 'express';
import { login, validateToken, logout, register } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/validate', validateToken);
router.post('/logout', logout);

export default router;
