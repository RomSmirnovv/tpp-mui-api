import { EmailVerificationToken } from '../models/emailVerificationToken.js';

class EmailVerificationTokenRepository {
	/**
	 * Создать токен подтверждения
	 */
	static async create(data) {
		const token = new EmailVerificationToken(data);
		return await token.save();
	}

	/**
	 * Найти токен по значению
	 */
	static async findByToken(token) {
		return await EmailVerificationToken.findOne({ token, used: false });
	}

	/**
	 * Найти активный токен для пользователя
	 */
	static async findActiveByUserId(userId) {
		return await EmailVerificationToken.findOne({
			userId,
			used: false,
			expiresAt: { $gt: new Date() }
		}).sort({ createdAt: -1 });
	}

	/**
	 * Пометить токен как использованный
	 */
	static async markAsUsed(tokenId) {
		return await EmailVerificationToken.updateOne(
			{ _id: tokenId },
			{ $set: { used: true } }
		);
	}

	/**
	 * Удалить все использованные токены пользователя
	 */
	static async deleteUsedTokens(userId) {
		return await EmailVerificationToken.deleteMany({
			userId,
			used: true
		});
	}

	/**
	 * Удалить истекшие токены (очистка)
	 */
	static async deleteExpiredTokens() {
		return await EmailVerificationToken.deleteMany({
			expiresAt: { $lt: new Date() }
		});
	}
}

export default EmailVerificationTokenRepository;
