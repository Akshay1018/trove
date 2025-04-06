import { Router } from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/auth';
import { isAuthenticated, isGuest } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { registerValidation, loginValidation } from '../validations/auth';

const router = Router();

router.post('/register', isGuest, validate(registerValidation), register);
router.post('/login', isGuest, validate(loginValidation), login);
router.post('/logout', isAuthenticated, logout);
router.get('/me', isAuthenticated, getCurrentUser);

export default router; 