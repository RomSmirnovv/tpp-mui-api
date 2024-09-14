import { Router } from "express";
import ColumnController from '../controllers/Column.js';

const columnRouter = Router();

columnRouter.post("/column", ColumnController.create)
columnRouter.get("/column/:id", ColumnController.getOne)
columnRouter.get("/column", ColumnController.getAll)
columnRouter.get("/columns/:userId", ColumnController.getAllByUser)
columnRouter.delete("/column/:id", ColumnController.delete)
columnRouter.patch("/column/:id", ColumnController.update)

export default columnRouter;
