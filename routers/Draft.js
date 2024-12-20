import { Router } from "express";
import DraftController from '../controllers/Draft.js';

const draftRouter = Router();

draftRouter.post("/draft", DraftController.create)
draftRouter.get("/draft/:id", DraftController.getOne)
draftRouter.get("/draft", DraftController.getAll)
draftRouter.get("/drafts/:userId", DraftController.getAllByUser)
draftRouter.delete("/draft/:id", DraftController.delete)
draftRouter.patch("/draft/:id", DraftController.update)

export default draftRouter;
