import { Router } from "express";
import ListController from '../controllers/List.js';

const listRouter = Router();

listRouter.post("/list", ListController.createList)
listRouter.get("/list/:id", ListController.getOneList)
listRouter.get("/list", ListController.getAllLists)
listRouter.get("/lists/:userId", ListController.getListsByUser)
listRouter.delete("/list/:id", ListController.deleteList)
listRouter.patch("/list", ListController.updateList)

export default listRouter;
