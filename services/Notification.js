import NotificationRepository from '../repositories/Notification.js';
import { Conflict } from '../utils/Errors.js'
import dotenv from "dotenv"
import dayjs from 'dayjs'
import { io } from '../server.js'
import moment from 'moment';

dotenv.config();

import config from '../config/env.js';
const DB_URL = config.database.url


class NotificationService {

	static async sendedNotification() {
		const nowDate = dayjs().format('YYYY-MM-DD HH:mm');
		const notifications = await NotificationRepository.getAllNotifications();
		const notSendNotifications = notifications.filter(notification => {
			return notification.sended === false
		})
		if (notSendNotifications.length > 0) {
			for (let i = 0; i < notSendNotifications.length; i++) {
				if (nowDate === notSendNotifications[i].notificationDateTime) {
					notSendNotifications[i].sended = true
					const response = await NotificationRepository.updateNotification({ id: notSendNotifications[i]._id, notification: notSendNotifications[i] }).then(data => {
						io.to(notSendNotifications[i].userId).emit("getNewNotifications", {
							data: notSendNotifications[i],
						})
					})
				}
			}
		}
	}


	static async createNotification(notification) {
		const companyId = notification.companyId
		const workspaceId = notification.workspaceId
		const notificationData = await NotificationRepository.getOneNotificationByCompany(companyId, workspaceId)
		if (notificationData) {
			const response = await NotificationRepository.updateNotification({ id: notificationData._id, notification }).then(data => {
				io.to(notificationData.userId).emit("updateNotification", {
					data: notificationData,
				})
			})
			return response
		} else {
			const response = await NotificationRepository.createNotification(notification)
			return response
		}
	}

	static async getOneNotification(id) {
		const response = await NotificationRepository.getOneNotification(id)
		return response
	}

	static async getOneNotificationByCompany(companyId) {
		const response = await NotificationRepository.getOneNotificationByCompany(companyId)
		return response
	}

	static async getAllNotifications(userId, workspaceId) {
		if (userId) {
			const response = await NotificationRepository.getAllNotificationsByUser(userId, workspaceId)
			return response
		} else {
			const response = await NotificationRepository.getAllNotifications(workspaceId)
			return response
		}
	}

	static async delete(id, workspaceId) {
		const notificationData = await NotificationRepository.getOneNotification(id, workspaceId);
		if (!notificationData) {
			throw new Conflict("Нет уведомления с таким ID");
		}
		await NotificationRepository.deleteNotification(id, workspaceId);
	}

	static async update({ id, notification, workspaceId }) {
		const notificationData = await NotificationRepository.getOneNotification(id, workspaceId);
		if (!notificationData) {
			throw new Conflict("Нет уведомления с таким ID");
		}

		const response = await NotificationRepository.updateNotification({ id, notification })

		io.to(notification.userId).emit("readNotification", {
			data: response,
		})
		return response
	}
}

export default NotificationService