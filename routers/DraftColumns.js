import { Router } from 'express';
import DraftColumnController from '../controllers/DraftColumn.js';
import { requireAdmin, requireAuth, forceOwnBody } from '../middlewares/auth.js';
import { requireDraftByParam, requireDraftFromBody, requireOwnedRecord } from '../middlewares/ownership.js';
import { DraftColumn } from '../models/draft_columns.js';

const draftColumnRouter = Router();

draftColumnRouter.post('/draftcolumn', requireAuth, requireDraftFromBody, forceOwnBody(), DraftColumnController.create);
draftColumnRouter.get('/draftcolumn', requireAuth, requireAdmin, DraftColumnController.getAll);
draftColumnRouter.get('/draftcolumn/:id', requireAuth, requireOwnedRecord(DraftColumn, { label: 'Колонка черновика' }), DraftColumnController.getOne);
draftColumnRouter.get('/draftcolumns/:draftId', requireAuth, requireDraftByParam('draftId'), DraftColumnController.getAllByDraft);
draftColumnRouter.delete('/draftcolumn/:id', requireAuth, requireOwnedRecord(DraftColumn, { label: 'Колонка черновика' }), DraftColumnController.delete);
draftColumnRouter.patch('/draftcolumn/:id', requireAuth, requireOwnedRecord(DraftColumn, { label: 'Колонка черновика' }), forceOwnBody(), DraftColumnController.update);

export default draftColumnRouter;
