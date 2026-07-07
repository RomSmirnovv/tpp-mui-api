import { Router } from 'express';
import ColumnController from '../controllers/Column.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.js';

const columnRouter = Router();

// Колонки — глобальная настройка таблицы, а не данные конкретного пользователя.
// Читать могут все авторизованные пользователи; менять — только администратор.
columnRouter.get('/column', requireAuth, ColumnController.getAll);
columnRouter.get('/column/:id', requireAuth, ColumnController.getOne);
columnRouter.get('/columns/:userId', requireAuth, ColumnController.getAllByUser);
columnRouter.post('/column', requireAuth, requireAdmin, ColumnController.create);
columnRouter.delete('/column/:id', requireAuth, requireAdmin, ColumnController.delete);
columnRouter.patch('/column/:id', requireAuth, requireAdmin, ColumnController.update);

export default columnRouter;
