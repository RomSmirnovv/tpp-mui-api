import mongoose from 'mongoose';

const Schema = mongoose.Schema

const messageSchema = new Schema({
	// Сообщение
	message: {
		type: String,
		required: true,
		default: '',
	},
	// Название комнаты
	room: {
		type: String,
		required: true
	},
	// ID пользователя
	userId: {
		type: String,
		required: true
	},
	// ФИО пользователя
	fullName: {
		type: String,
		required: true
	},
	// Дата и время сообщения
	dateTime: {
		type: String,
		required: true
	},
	// ID workspace (компании)
	workspaceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Workspace',
		required: false,
		default: null
	}
}, { strict: false })

export const Message = mongoose.model('Message', messageSchema)
