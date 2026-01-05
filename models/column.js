import mongoose from 'mongoose';

const Schema = mongoose.Schema

const columnSchema = new Schema({
	// Название колонки
	name: {
		type: String,
		required: true,
	},
	// Название колонки латиницей
	slug: {
		type: String,
		required: true,
	},
	// тип колонки
	type: {
		type: String,
		required: true,
	},
	// Удаляемый ли столбец или нет
	isDeleted: {
		type: Boolean,
		required: true,
		default: false,
	},
	// ID workspace (компании)
	workspaceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Workspace',
		required: false,
		default: null
	}
})

export const Column = mongoose.model('Column', columnSchema)
