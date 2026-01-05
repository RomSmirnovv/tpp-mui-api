import mongoose from 'mongoose';

const Schema = mongoose.Schema

const notificationSchema = new Schema({
	// Сообщение
	message: {
		type: String,
		required: true
	},
	// Дата создания
	createdDate: {
		type: String,
		required: true
	},
	// Дата и время уведомления
	notificationDateTime: {
		type: String,
		required: true
	},
	// Дата уведомления
	notificationDate: {
		type: String,
		required: true
	},
	// Время уведомления
	notificationTime: {
		type: String,
		required: true
	},
	// Id сотрудника
	userId: {
		type: String,
		required: true
	},
	// Id компании
	companyId: {
		type: String,
		required: true
	},
	// Прочитано или нет
	readed: {
		type: Boolean,
		required: true,
		default: false
	},
	// Отправлено или нет
	sended: {
		type: Boolean,
		required: true,
		default: false
	},
	// ID workspace (компании)
	workspaceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Workspace',
		required: false,
		default: null
	}
})

export const Notification = mongoose.model('Notification', notificationSchema)
