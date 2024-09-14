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
	pText: {
		type: String,
		required: false
	},
	blocked: {
		type: Boolean,
		default: false,
	}
})

export const User = mongoose.model('User', userSchema)
