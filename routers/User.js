import { Router } from "express";
import UserController from '../controllers/User.js';

const userRouter = Router();

userRouter.post("/user", UserController.createUser)
userRouter.get("/user/:id", UserController.getUserByProfile)
userRouter.get("/user", UserController.getAllUsers)
userRouter.delete("/user/:id", UserController.deleteUser)
userRouter.patch("/user", UserController.updateUser)
userRouter.get("/userme", UserController.getUser)

export default userRouter;
