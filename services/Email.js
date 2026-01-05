import nodemailer from 'nodemailer';
import config from '../config/env.js';
import crypto from 'crypto';

class EmailService {
	constructor() {
		// Определяем secure на основе порта, если не указано явно
		const isSecure = config.email.smtp.secure !== undefined 
			? config.email.smtp.secure 
			: (config.email.smtp.port === 465);

		// Создаем транспортер для SMTP
		this.transporter = nodemailer.createTransport({
			host: config.email.smtp.host,
			port: config.email.smtp.port,
			secure: isSecure, // true для 465 (SSL), false для 587 (TLS)
			auth: {
				user: config.email.smtp.user,
				pass: config.email.smtp.password
			},
			// Дополнительные опции для надежности
			tls: {
				rejectUnauthorized: false // Для самоподписанных сертификатов
			}
		});

		// Проверяем подключение при создании (асинхронно, не блокируем)
		this.verifyConnection().catch(err => {
			console.warn('⚠️  Предупреждение: не удалось проверить SMTP подключение:', err.message);
		});
	}

	/**
	 * Проверка подключения к SMTP серверу
	 */
	async verifyConnection() {
		try {
			await this.transporter.verify();
			console.log('✅ SMTP сервер готов к отправке писем');
		} catch (error) {
			console.error('❌ Ошибка подключения к SMTP серверу:', error);
		}
	}

	/**
	 * Генерация токена для подтверждения email
	 */
	generateVerificationToken() {
		return crypto.randomBytes(32).toString('hex');
	}

	/**
	 * Отправка email для подтверждения регистрации
	 * @param {string} email - Email получателя
	 * @param {string} token - Токен подтверждения
	 * @param {string} userName - Имя пользователя
	 * @returns {Promise<Object>}
	 */
	async sendVerificationEmail(email, token, userName) {
		const verificationUrl = `${config.email.frontendUrl}/verify-email/${token}`;

		const mailOptions = {
			from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
			to: email,
			subject: 'Подтверждение регистрации',
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Подтверждение регистрации</title>
				</head>
				<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
						<h1 style="color: #333; margin-top: 0;">Добро пожаловать, ${userName}!</h1>
						<p>Спасибо за регистрацию. Для завершения регистрации необходимо подтвердить ваш email адрес.</p>
						<p>Нажмите на кнопку ниже, чтобы подтвердить ваш email:</p>
						<div style="text-align: center; margin: 30px 0;">
							<a href="${verificationUrl}" 
							   style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
								Подтвердить email
							</a>
						</div>
						<p style="font-size: 12px; color: #666;">Если кнопка не работает, скопируйте и вставьте следующую ссылку в браузер:</p>
						<p style="font-size: 12px; color: #666; word-break: break-all;">${verificationUrl}</p>
						<p style="font-size: 12px; color: #666; margin-top: 30px;">Эта ссылка действительна в течение 24 часов.</p>
						<p style="font-size: 12px; color: #666;">Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
					</div>
				</body>
				</html>
			`
		};

		try {
			const info = await this.transporter.sendMail(mailOptions);
			console.log('✅ Email отправлен успешно:', info.messageId);
			return {
				messageId: info.messageId,
				response: info.response
			};
		} catch (error) {
			console.error('❌ Ошибка отправки email через SMTP:', error);
			throw new Error(`Не удалось отправить email: ${error.message}`);
		}
	}

	/**
	 * Отправка email для повторной отправки токена
	 * @param {string} email - Email получателя
	 * @param {string} token - Токен подтверждения
	 * @param {string} userName - Имя пользователя
	 * @returns {Promise<Object>}
	 */
	async sendResendVerificationEmail(email, token, userName) {
		const verificationUrl = `${config.email.frontendUrl}/verify-email/${token}`;

		const mailOptions = {
			from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
			to: email,
			subject: 'Подтверждение email (повторная отправка)',
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Подтверждение email</title>
				</head>
				<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
						<h1 style="color: #333; margin-top: 0;">Подтверждение email</h1>
						<p>Здравствуйте, ${userName}!</p>
						<p>Вы запросили повторную отправку ссылки для подтверждения email.</p>
						<p>Нажмите на кнопку ниже, чтобы подтвердить ваш email:</p>
						<div style="text-align: center; margin: 30px 0;">
							<a href="${verificationUrl}" 
							   style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
								Подтвердить email
							</a>
						</div>
						<p style="font-size: 12px; color: #666;">Если кнопка не работает, скопируйте и вставьте следующую ссылку в браузер:</p>
						<p style="font-size: 12px; color: #666; word-break: break-all;">${verificationUrl}</p>
						<p style="font-size: 12px; color: #666; margin-top: 30px;">Эта ссылка действительна в течение 24 часов.</p>
					</div>
				</body>
				</html>
			`
		};

		try {
			const info = await this.transporter.sendMail(mailOptions);
			console.log('✅ Email отправлен успешно:', info.messageId);
			return {
				messageId: info.messageId,
				response: info.response
			};
		} catch (error) {
			console.error('❌ Ошибка отправки email через SMTP:', error);
			throw new Error(`Не удалось отправить email: ${error.message}`);
		}
	}
}

export default new EmailService();
