import { Router } from "express";
import MessageController from '../controllers/Message.js';

const messageRouter = Router();

messageRouter.post("/message", MessageController.create)
messageRouter.get("/message/:id", MessageController.getOne)
messageRouter.get("/message", MessageController.getAll)
messageRouter.get("/message/:room", MessageController.getAllByRoom)
messageRouter.delete("/message/:id", MessageController.delete)
messageRouter.patch("/message/:id", MessageController.update)

export default messageRouter;
