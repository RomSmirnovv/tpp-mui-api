import mongoose from 'mongoose';

const Schema = mongoose.Schema

const companySchema = new Schema({
	// Название компании
	name: {
		type: String,
		required: false,
		default: '',
	},
	// Орг структура
	orgStructure: {
		type: String,
		required: false
	},
	// Локация, город
	location: {
		type: String,
		required: false,
		default: '',
	},
	// Сотрудник (ФИО)
	person: {
		type: String,
		required: false,
		default: '',
	},
	// Телефон
	phone: {
		type: String,
		required: false,
		default: '',
	},
	// E-mail
	email: {
		type: String,
		required: false,
		default: '',
	},
	// Потребность
	requirement: {
		type: String,
		required: false,
		default: '',
	},
	// Предложение
	offer: {
		type: String,
		required: false,
		default: '',
	},
	// Примечание
	note: {
		type: String,
		required: false,
		default: '',
	},
	// Цвет
	color: {
		type: String,
		required: false,
		default: '',
	},
	// Ссылка на файл
	fileLink: {
		type: String,
		required: false,
		default: '',
	},
	// Дата изменения
	updateDate: {
		type: String,
		required: false,
		default: '',
	},
	// Дата и время уведомления
	notificationDateTime: {
		type: String,
		required: false
	},
	// Название листа
	listName: {
		type: String,
		required: false,
		default: 'Основной',
	},
	// Название листа откуда удалили запись
	delListName: {
		type: String,
		required: false,
		default: 'Основной',
	},
	// Комментарий при удалении
	delComment: {
		type: String,
		required: false,
		default: '',
	},
	// Отмечена звездочкой или нет
	favorite: {
		type: Boolean,
		required: true,
		default: false,
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
	}
}, { strict: false })

export const Company = mongoose.model('Company', companySchema)
