import { Router } from 'express';
import UserController from '../controllers/User.js';
import { requireAdmin, requireAuth, requireSelfOrAdmin } from '../middlewares/auth.js';

const userRouter = Router();

userRouter.get('/userme', requireAuth, UserController.getUser);
userRouter.get('/user', requireAuth, UserController.getAllUsers);
userRouter.post('/user', requireAuth, requireAdmin, UserController.createUser);
userRouter.get('/user/:id', requireAuth, requireSelfOrAdmin('id'), UserController.getUserByProfile);
userRouter.patch('/user', requireAuth, requireAdmin, UserController.updateUser);
userRouter.delete('/user/:id', requireAuth, requireAdmin, UserController.deleteUser);

export default userRouter;
