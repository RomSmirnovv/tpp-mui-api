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

	static async getOneNotification(id) {
		const response = await Notification
			.findOne({ _id: id })
			.then((notification) => {
				return notification
			})
		if (!response) {
			return null;
		}
		return response
	}


	static async getAllNotificationsByUser(id) {
		const response = await Notification
			.find({ userId: id, sended: true })
			.then((notification) => {
				return notification
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getOneNotificationByCompany(companyId) {
		const response = await Notification
			.findOne({ companyId })
			.then((notification) => {
				return notification
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllNotifications() {
		const response = await Notification.find()
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
		if (!response) {
			return null;
		}
		return response
	}

	static async deleteNotification(id) {
		await Notification
			.deleteOne({ _id: id })
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
