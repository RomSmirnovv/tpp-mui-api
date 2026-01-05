import NotificationService from '../services/Notification.js'
import ErrorsUtils from "../utils/Errors.js";
import { getWorkspaceIdFromRequest } from '../utils/getWorkspaceId.js';

class NotificationController {

	static async createNotification(req, res) {
		const notification = req.body
		try {
			// Получаем workspaceId из запроса
			const workspaceId = await getWorkspaceIdFromRequest(req);
			if (workspaceId) {
				notification.workspaceId = workspaceId;
			}
			const newNotification = await NotificationService.createNotification(notification)
			return res.status(200).json(newNotification);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async getOneNotification(req, res) {
		const { id } = req.params
		try {
			const notification = await NotificationService.getOneNotification(id)
			return res.status(200).json(notification);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}


	static async getAllNotifications(req, res) {
		try {
			// Получаем workspaceId из запроса для фильтрации
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const notifications = await NotificationService.getAllNotifications(null, workspaceId)
			return res.status(200).json(notifications)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}


	static async getAllNotificationsByUser(req, res) {
		const { userId } = req.params
		try {
			// Получаем workspaceId из запроса для фильтрации
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const notifications = await NotificationService.getAllNotifications(userId, workspaceId)
			return res.status(200).json(notifications)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async deleteNotification(req, res) {
		const { id } = req.params
		try {
			// Получаем workspaceId из запроса для проверки принадлежности
			const workspaceId = await getWorkspaceIdFromRequest(req);
			await NotificationService.delete(id, workspaceId)
			return res.status(200).json(`Уведомление с id = ${id} удалено!`)
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async updateNotification(req, res) {
		const { id } = req.params
		const notification = req.body
		try {
			// Получаем workspaceId из запроса для проверки принадлежности
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const updateNotification = await NotificationService.update({ id, notification, workspaceId })
			return res.status(200).json(updateNotification);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default NotificationController