import EmailVerificationTokenRepository from '../repositories/EmailVerificationToken.js';
import EmailService from './Email.js';
import UserRepository from '../repositories/User.js';
import { NotFound, Conflict } from '../utils/Errors.js';

class EmailVerificationService {
	/**
	 * Создать и отправить токен подтверждения
	 * @param {string} userId - ID пользователя
	 * @param {string} email - Email для подтверждения
	 * @param {string} userName - Имя пользователя
	 * @returns {Promise<Object>}
	 */
	static async createAndSendToken(userId, email, userName) {
		// Удаляем старые использованные токены
		await EmailVerificationTokenRepository.deleteUsedTokens(userId);

		// Проверяем, есть ли активный токен
		const existingToken = await EmailVerificationTokenRepository.findActiveByUserId(userId);
		if (existingToken) {
			// Если токен еще активен, отправляем его снова
			await EmailService.sendResendVerificationEmail(email, existingToken.token, userName);
			return {
				token: existingToken.token,
				message: 'Токен уже существует, отправлен повторно'
			};
		}

		// Генерируем новый токен
		const token = EmailService.generateVerificationToken();
		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + 24); // 24 часа

		// Создаем токен в базе
		const verificationToken = await EmailVerificationTokenRepository.create({
			userId,
			token,
			email,
			expiresAt
		});

		// Отправляем email
		await EmailService.sendVerificationEmail(email, token, userName);

		return {
			token: verificationToken.token,
			expiresAt: verificationToken.expiresAt
		};
	}

	/**
	 * Подтвердить email по токену
	 * @param {string} token - Токен подтверждения
	 * @returns {Promise<Object>}
	 */
	static async verifyEmail(token) {
		console.log('🔍 Поиск токена подтверждения:', token ? token.substring(0, 20) + '...' : 'отсутствует');
		
		// Находим токен
		const verificationToken = await EmailVerificationTokenRepository.findByToken(token);
		
		if (!verificationToken) {
			console.log('❌ Токен не найден в базе. Проверяем все токены...');
			// Дополнительная диагностика: проверяем, есть ли токен вообще (даже использованный)
			const { EmailVerificationToken } = await import('../models/emailVerificationToken.js');
			const allTokens = await EmailVerificationToken.find({ token }).limit(5);
			console.log('📊 Найдено токенов с таким значением:', allTokens.length);
			if (allTokens.length > 0) {
				console.log('📋 Статус найденных токенов:', allTokens.map(t => ({ used: t.used, expiresAt: t.expiresAt })));
			}
			throw new NotFound('Токен подтверждения не найден или уже использован');
		}
		
		console.log('✅ Токен найден:', {
			userId: verificationToken.userId,
			used: verificationToken.used,
			expiresAt: verificationToken.expiresAt,
			now: new Date()
		});

		// Проверяем срок действия
		if (verificationToken.expiresAt < new Date()) {
			throw new Conflict('Токен подтверждения истек. Запросите новую ссылку.');
		}

		// Проверяем, не использован ли уже
		if (verificationToken.used) {
			throw new Conflict('Токен подтверждения уже использован');
		}

		// Находим пользователя
		const user = await UserRepository.getUserById(verificationToken.userId);
		if (!user) {
			throw new NotFound('Пользователь не найден');
		}

		// Проверяем, не подтвержден ли уже email
		if (user.isEmailVerified) {
			// Помечаем токен как использованный
			await EmailVerificationTokenRepository.markAsUsed(verificationToken._id);
			return {
				message: 'Email уже подтвержден',
				alreadyVerified: true
			};
		}

		// Подтверждаем email
		user.isEmailVerified = true;
		await user.save();

		// Помечаем токен как использованный
		await EmailVerificationTokenRepository.markAsUsed(verificationToken._id);

		return {
			message: 'Email успешно подтвержден',
			userId: user._id
		};
	}

	/**
	 * Повторная отправка токена подтверждения
	 * @param {string} userId - ID пользователя
	 * @returns {Promise<Object>}
	 */
	static async resendToken(userId) {
		const user = await UserRepository.getUserById(userId);
		if (!user) {
			throw new NotFound('Пользователь не найден');
		}

		if (user.isEmailVerified) {
			throw new Conflict('Email уже подтвержден');
		}

		// Получаем email из workspace
		const { Workspace } = await import('../models/workspace.js');
		const workspace = await Workspace.findById(user.workspaceId);
		if (!workspace) {
			throw new NotFound('Workspace не найден');
		}

		const email = workspace.email;
		const userName = `${user.name} ${user.surname}`.trim();

		return await this.createAndSendToken(userId, email, userName);
	}
}

export default EmailVerificationService;
