import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
	// Название компании/workspace
	name: {
		type: String,
		required: true,
		trim: true
	},
	// Логотип компании (путь к файлу)
	logo: {
		type: String,
		required: false,
		default: ''
	},
	// Цвета компании (массив из 2-3 цветов)
	colors: {
		type: [String],
		required: false,
		default: [],
		validate: {
			validator: function(v) {
				return v.length <= 3;
			},
			message: 'Максимум 3 цвета'
		}
	},
	// Email компании
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	},
	// Телефон компании
	phone: {
		type: String,
		required: true,
		trim: true
	},
	// Количество сотрудников
	employeesCount: {
		type: Number,
		required: false,
		default: 1,
		min: 1
	},
	// Какие колонки должны быть в базе (массив названий колонок)
	columns: {
		type: [String],
		required: false,
		default: []
	},
	// Дата создания
	createdAt: {
		type: Date,
		default: Date.now
	},
	// Дата обновления
	updatedAt: {
		type: Date,
		default: Date.now
	}
}, { 
	timestamps: true,
	strict: false 
});

// Индекс для быстрого поиска
workspaceSchema.index({ email: 1 });
workspaceSchema.index({ name: 1 });

export const Workspace = mongoose.model('Workspace', workspaceSchema);
