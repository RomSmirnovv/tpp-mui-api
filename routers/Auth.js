import { Router } from 'express';
import AuthController from '../controllers/Auth.js';

const authRouter = Router();

authRouter.post('/sign-in', AuthController.signIn);
authRouter.post('/refresh', AuthController.refresh);
authRouter.post('/logout', AuthController.logOut);

// Публичная регистрация намеренно отключена.
// Новых пользователей создаёт только администратор через POST /user.

export default authRouter;
