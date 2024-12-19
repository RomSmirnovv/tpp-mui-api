import { Router } from "express";
import DraftColumnController from '../controllers/DraftColumn.js';

const draftColumnRouter = Router();

draftColumnRouter.post("/draftcolumn", DraftColumnController.create)
draftColumnRouter.get("/draftcolumn/:id", DraftColumnController.getOne)
draftColumnRouter.get("/draftcolumn", DraftColumnController.getAll)
draftColumnRouter.get("/draftcolumns/:userId", DraftColumnController.getAllByUser)
draftColumnRouter.delete("/draftcolumn/:id", DraftColumnController.delete)
draftColumnRouter.patch("/draftcolumn/:id", DraftColumnController.update)

export default draftColumnRouter;
