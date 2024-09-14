import mongoose from 'mongoose';

const Schema = mongoose.Schema

const schedulesSchema = new Schema({
	name: {
		type: String,
	},
	data: {
		type: Object,
	},
	priority: {
		type: Number,
	},
	shouldSaveResult: {
		type: Boolean,
	},
	type: {
		type: String,
	},
	nextRunAt: {
		type: Date,
	}
})

export const Schedules = mongoose.model('Schedules', schedulesSchema)
