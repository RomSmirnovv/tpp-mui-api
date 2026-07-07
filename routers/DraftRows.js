import { Router } from 'express';
import DraftRowController from '../controllers/DraftRow.js';
import { requireAdmin, requireAuth, forceOwnBody } from '../middlewares/auth.js';
import { requireDraftByParam, requireDraftFromBody, requireOwnedRecord } from '../middlewares/ownership.js';
import { DraftRow } from '../models/draft_rows.js';

const draftRowRouter = Router();

draftRowRouter.post('/draftrow', requireAuth, requireDraftFromBody, forceOwnBody({ fullNameField: 'fullName' }), DraftRowController.create);
draftRowRouter.get('/draftrow', requireAuth, requireAdmin, DraftRowController.getAll);
draftRowRouter.get('/draftrow/:id', requireAuth, requireOwnedRecord(DraftRow, { label: 'Строка черновика' }), DraftRowController.getOne);
draftRowRouter.get('/draftrows/:draftId', requireAuth, requireDraftByParam('draftId'), DraftRowController.getAllByDraft);
draftRowRouter.delete('/draftrow/:id', requireAuth, requireOwnedRecord(DraftRow, { label: 'Строка черновика' }), DraftRowController.delete);
draftRowRouter.patch('/draftrow/:id', requireAuth, requireOwnedRecord(DraftRow, { label: 'Строка черновика' }), forceOwnBody({ fullNameField: 'fullName' }), DraftRowController.update);

export default draftRowRouter;
