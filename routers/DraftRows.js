import { Router } from "express";
import DraftRowController from '../controllers/DraftRow.js';

const draftRowRouter = Router();

draftRowRouter.post("/draftrow", DraftRowController.create)
draftRowRouter.get("/draftrow/:id", DraftRowController.getOne)
draftRowRouter.get("/draftrow", DraftRowController.getAll)
draftRowRouter.get("/draftrows/:draftId", DraftRowController.getAllByDraft)
draftRowRouter.delete("/draftrow/:id", DraftRowController.delete)
draftRowRouter.patch("/draftrow/:id", DraftRowController.update)

export default draftRowRouter;
