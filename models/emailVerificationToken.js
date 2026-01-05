import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const emailVerificationTokenSchema = new Schema({
	// ID пользователя
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true
	},
	// Токен для подтверждения
	token: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	// Email для подтверждения
	email: {
		type: String,
		required: true
	},
	// Дата истечения токена (24 часа)
	expiresAt: {
		type: Date,
		required: true,
		index: { expireAfterSeconds: 0 } // Автоматическое удаление после истечения
	},
	// Использован ли токен
	used: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

export const EmailVerificationToken = mongoose.model('EmailVerificationToken', emailVerificationTokenSchema);
