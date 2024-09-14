import mongoose from 'mongoose';

const Schema = mongoose.Schema

const refreshSessionSchema = new Schema({
	user_id: {
		type: String,
		required: true
	},
	refresh_token: {
		type: String,
		required: true
	},
	finger_print: {
		type: String,
		required: true
	}
})

export const RefreshSession = mongoose.model('RefreshSession', refreshSessionSchema)
