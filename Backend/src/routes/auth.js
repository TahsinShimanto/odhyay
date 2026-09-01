import { Router } from 'express';
import { login, refresh, logout } from '../controllers/authController.js'

const authRouter = Router();

// login API
authRouter.post('/login', login)

// refresh token API
authRouter.post('/refresh', refresh)

// logout API
authRouter.post('/logout', logout)

export default authRouter;