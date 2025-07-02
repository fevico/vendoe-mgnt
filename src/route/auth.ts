import { Router } from 'express';
import { validate } from 'src/middleware/validator';
import { loginSchema, registerSchema } from 'src/middleware/schema';
import { AuthController } from '@/controller/auth';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', validate(loginSchema), authController.login.bind(authController));
authRouter.post('/register', validate(registerSchema), authController.register.bind(authController));
authRouter.post('/logout', authController.logout.bind(authController));

export default authRouter;