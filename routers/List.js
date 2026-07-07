import { Router } from 'express';
import ListController from '../controllers/List.js';
import { requireAdmin, requireAuth, requireSelfOrAdmin, forceOwnBody } from '../middlewares/auth.js';
import { requireOwnedBodyRecord, requireOwnedRecord } from '../middlewares/ownership.js';
import { List } from '../models/list.js';

const listRouter = Router();

listRouter.post('/list', requireAuth, forceOwnBody(), ListController.createList);
listRouter.get('/list', requireAuth, requireAdmin, ListController.getAllLists);
listRouter.get('/list/:id', requireAuth, requireOwnedRecord(List, { label: 'Лист' }), ListController.getOneList);
listRouter.get('/lists/:userId', requireAuth, requireSelfOrAdmin('userId'), ListController.getListsByUser);
listRouter.delete('/list/:id', requireAuth, requireOwnedRecord(List, { label: 'Лист' }), ListController.deleteList);
listRouter.patch('/list', requireAuth, requireOwnedBodyRecord(List, { label: 'Лист' }), forceOwnBody(), ListController.updateList);

export default listRouter;
