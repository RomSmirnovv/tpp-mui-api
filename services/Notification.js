import NotificationRepository from '../repositories/Notification.js';
import { Conflict } from '../utils/Errors.js'
import dotenv from "dotenv"
import Agenda from "agenda";
import dayjs from 'dayjs'
import { Notification } from '../models/notification.js'
import { Schedules } from '../models/schedule.js'
import { io } from '../server.js'
import moment from 'moment';

dotenv.config();

const DB_URL = process.env.DB_URL

const agendaSchedules = new Agenda({
	db: {
		address: DB_URL,
		collection: "schedules",
	},
});

agendaSchedules.define("createSchedule", async (schedule) => {
	const activeSchedule = schedule
	let sendedNotification = schedule?.attrs?.data;
	sendedNotification.sended = true

	const updatedNotification = await Notification.updateOne({ _id: sendedNotification._id }, { $set: sendedNotification })


	io.to(sendedNotification.userId).emit("getNewNotifications", {
		data: sendedNotification,
	})
});

agendaSchedules.start();


class NotificationService {


	static async createNotification(notification) {
		const companyId = notification.companyId
		const notificationData = await NotificationRepository.getOneNotificationByCompany(companyId)
		if (notificationData) {
			let _ids = []
			const ids = await Schedules.find({ name: 'createSchedule' })
			if (ids && ids.length != 0) {
				const scheduleSaved = ids.filter(d => d.data?.companyId == companyId)
				if (scheduleSaved && scheduleSaved.length != 0) {
					for (let i = 0; i < scheduleSaved.length; i++) {
						if (scheduleSaved[i].data.companyId == companyId) {
							_ids.push(scheduleSaved[i]._id.toString())
						}
					}
					await Schedules.deleteMany({ _id: { $in: _ids } })
				}
			}

			const response = await NotificationRepository.updateNotification({ id: notificationData._id, notification }).then(data => {
				const now = moment().format('YYYY-MM-DD HH:mm');
				const end = notification.notificationDateTime;
				const duration = moment.duration(moment(end).diff(now));
				var minutes = duration.minutes();
				duration.subtract(moment.duration(minutes, 'minutes'));

				agendaSchedules.schedule(
					'in ' + minutes + ' minutes',
					'createSchedule',
					data
				);
				io.to(notificationData.userId).emit("updateNotification", {
					data: notificationData,
				})
			})




			return response
		} else {
			const response = await NotificationRepository.createNotification(notification).then(data => {
				const now = moment().format('YYYY-MM-DD HH:mm');
				const end = notification.notificationDateTime;
				const duration = moment.duration(moment(end).diff(now));
				var minutes = duration.minutes();
				duration.subtract(moment.duration(minutes, 'minutes'));
				agendaSchedules.schedule(
					'in ' + minutes + ' minutes',
					'createSchedule',
					data
				);
			})
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

	static async getAllNotifications(userId) {
		if (userId) {
			const response = await NotificationRepository.getAllNotificationsByUser(userId)
			return response
		} else {
			const response = await NotificationRepository.getAllNotifications()
			return response
		}
	}

	static async delete(id) {
		const notificationData = await NotificationRepository.getOneNotification(id);
		if (!notificationData) {
			throw new Conflict("Нет уведомления с таким ID");
		}
		await NotificationRepository.deleteNotification(id);
	}

	static async update({ id, notification }) {
		const notificationData = await NotificationRepository.getOneNotification(id);
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