import { Router } from 'express';
import DraftController from '../controllers/Draft.js';
import { requireAdmin, requireAuth, requireSelfOrAdmin, forceOwnBody } from '../middlewares/auth.js';
import { requireOwnedBodyRecord, requireOwnedRecord } from '../middlewares/ownership.js';
import { Draft } from '../models/draft.js';

const draftRouter = Router();

draftRouter.post('/draft', requireAuth, forceOwnBody(), DraftController.create);
draftRouter.get('/draft', requireAuth, requireAdmin, DraftController.getAll);
draftRouter.get('/draft/:id', requireAuth, requireOwnedRecord(Draft, { label: 'Черновик' }), DraftController.getOne);
draftRouter.get('/drafts/:userId', requireAuth, requireSelfOrAdmin('userId'), DraftController.getAllByUser);
draftRouter.delete('/draft/:id', requireAuth, requireOwnedRecord(Draft, { label: 'Черновик' }), DraftController.delete);
draftRouter.patch('/draft/:id', requireAuth, requireOwnedRecord(Draft, { label: 'Черновик' }), forceOwnBody(), DraftController.update);

export default draftRouter;
