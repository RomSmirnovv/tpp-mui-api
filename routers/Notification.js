import { Router } from 'express';
import NotificationController from '../controllers/Notification.js';
import { requireAdmin, requireAuth, requireSelfOrAdmin, forceOwnBody } from '../middlewares/auth.js';
import { requireCompanyFromBody, requireOwnedRecord } from '../middlewares/ownership.js';
import { Notification } from '../models/notification.js';

const notificationRouter = Router();

notificationRouter.post('/notification', requireAuth, requireCompanyFromBody, forceOwnBody(), NotificationController.createNotification);
notificationRouter.get('/notification', requireAuth, requireAdmin, NotificationController.getAllNotifications);
notificationRouter.get('/notification/:id', requireAuth, requireOwnedRecord(Notification, { label: 'Уведомление' }), NotificationController.getOneNotification);
notificationRouter.get('/notifications/:userId', requireAuth, requireSelfOrAdmin('userId'), NotificationController.getAllNotificationsByUser);
notificationRouter.delete('/notification/:id', requireAuth, requireOwnedRecord(Notification, { label: 'Уведомление' }), NotificationController.deleteNotification);
notificationRouter.patch('/notification/:id', requireAuth, requireOwnedRecord(Notification, { label: 'Уведомление' }), forceOwnBody(), NotificationController.updateNotification);

export default notificationRouter;
