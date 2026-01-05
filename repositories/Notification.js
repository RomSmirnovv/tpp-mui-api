import mongoose from 'mongoose';
import { Notification } from '../models/notification.js'
import dayjs from 'dayjs'

class NotificationRepository {


	static async createNotification(notification) {
		const newNotification = await new Notification(notification)
		const response = newNotification
			.save()
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
		if (!response) {
			return null;
		}
		return response

	}

	static async getOneNotification(id, workspaceId) {
		const query = { _id: id };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Notification
			.findOne(query)
			.then((notification) => {
				return notification
			})
		if (!response) {
			return null;
		}
		return response
	}


	static async getAllNotificationsByUser(id, workspaceId) {
		const query = { userId: id, sended: true };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Notification
			.find(query)
			.then((notification) => {
				return notification
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getOneNotificationByCompany(companyId, workspaceId) {
		const query = { companyId };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Notification
			.findOne(query)
			.then((notification) => {
				return notification
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllNotifications(workspaceId) {
		const query = {};
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Notification.find(query)
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
		if (!response) {
			return null;
		}
		return response
	}

	static async deleteNotification(id, workspaceId) {
		const query = { _id: id };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		await Notification
			.deleteOne(query)
	}

	static async updateNotification({ id, notification }) {
		await Notification
			.updateOne({ _id: id }, { $set: notification })
			.then((notificationRes) => {
				return notificationRes
			})
		const response = Notification
			.findOne({ _id: id })
			.then((notificationRes) => {
				return notificationRes
			})
		if (!response) {
			return null;
		}
		return response
	}
}

export default NotificationRepository;
