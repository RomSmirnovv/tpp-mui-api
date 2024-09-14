import mongoose from 'mongoose';

const Schema = mongoose.Schema

const listSchema = new Schema({
	// Название листа
	name: {
		type: String,
		required: true
	},
	// ID пользователя кто создал лист
	userId: {
		type: String,
		required: true
	},
	checked: {
		type: Boolean,
		required: true
	},
	order: {
		type: Number,
		required: true
	},
	// массив колонок
	columns: {
		type: Array,
		required: false
	}
})

export const List = mongoose.model('List', listSchema)
