import { Router } from 'express';
import MessageController from '../controllers/Message.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.js';
import { protectMessageBody, requireOwnedRecord, requireRoomParticipant } from '../middlewares/ownership.js';
import { Message } from '../models/message.js';

const messageRouter = Router();

messageRouter.post('/message', requireAuth, protectMessageBody, MessageController.create);
messageRouter.get('/message', requireAuth, requireAdmin, MessageController.getAll);
messageRouter.get('/message/:id', requireAuth, requireOwnedRecord(Message, { label: 'Сообщение' }), MessageController.getOne);
// Исторический маршрут /message/:room в старом проекте конфликтовал с /message/:id.
// Новый маршрут не ломает существующие socket-сообщения и оставлен на будущее для REST-клиента.
messageRouter.get('/messages/room/:room', requireAuth, requireRoomParticipant('room'), MessageController.getAllByRoom);
messageRouter.delete('/message/:id', requireAuth, requireOwnedRecord(Message, { label: 'Сообщение' }), MessageController.delete);
messageRouter.patch('/message/:id', requireAuth, requireOwnedRecord(Message, { label: 'Сообщение' }), protectMessageBody, MessageController.update);

export default messageRouter;
