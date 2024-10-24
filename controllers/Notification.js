import NotificationService from '../services/Notification.js'
import ErrorsUtils from "../utils/Errors.js";

class NotificationController {

	static async createNotification(req, res) {
		const notification = req.body
		console.log('notification', notification)
		try {
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
			const notifications = await NotificationService.getAllNotifications()
			return res.status(200).json(notifications)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}


	static async getAllNotificationsByUser(req, res) {
		const { userId } = req.params
		try {
			const notifications = await NotificationService.getAllNotifications(userId)
			return res.status(200).json(notifications)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async deleteNotification(req, res) {
		const { id } = req.params
		try {
			await NotificationService.delete(id)
			return res.status(200).json(`Уведомление с id = ${id} удалено!`)
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async updateNotification(req, res) {
		const { id } = req.params
		const notification = req.body
		try {
			const updateNotification = await NotificationService.update({ id, notification })
			return res.status(200).json(updateNotification);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default NotificationController