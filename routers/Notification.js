import { Router } from "express";
import NotificationController from '../controllers/Notification.js';

const notificationRouter = Router();

notificationRouter.post("/notification", NotificationController.createNotification)
notificationRouter.get("/notification/:id", NotificationController.getOneNotification)
notificationRouter.get("/notification", NotificationController.getAllNotifications)
notificationRouter.get("/notifications/:userId", NotificationController.getAllNotificationsByUser)
notificationRouter.delete("/notification/:id", NotificationController.deleteNotification)
notificationRouter.patch("/notification/:id", NotificationController.updateNotification)

export default notificationRouter;
