import mongoose from 'mongoose';

const Schema = mongoose.Schema

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
	},
	patronymic: {
		type: String,
		required: false
	},
	birthDate: {
		type: String,
		required: false
	},
	role: {
		type: Number,
		required: true,
		max: 9
	},
	login: {
		type: String,
		required: true,
		unique: true
	},
	phone: {
		type: String,
		required: false,
		default: '',
	},
	password: {
		type: String,
		required: true
	},
	blocked: {
		type: Boolean,
		default: false,
	},
	// Подтвержден ли email
	isEmailVerified: {
		type: Boolean,
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

export const User = mongoose.model('User', userSchema)
