/**
 * Централизованная конфигурация приложения
 * Все переменные окружения загружаются и валидируются здесь
 */

import dotenv from 'dotenv';
import EnvValidator from '../utils/validateEnv.js';

// Загрузка переменных окружения
dotenv.config();

// Валидация переменных окружения
const validationResult = EnvValidator.validate();

// Вывод результатов валидации только в development режиме
if (process.env.NODE_ENV !== 'production') {
	EnvValidator.printResults(validationResult);
}

// Если есть критические ошибки, останавливаем приложение
if (!validationResult.isValid) {
	console.error('\n❌ Критические ошибки в конфигурации. Приложение не может быть запущено.\n');
	process.exit(1);
}

/**
 * Конфигурация приложения
 */
const config = {
	// Сервер
	server: {
		port: parseInt(process.env.PORT, 10) || 5000,
		env: process.env.NODE_ENV || 'development'
	},

	// База данных
	database: {
		url: process.env.DB_URL
	},

	// CORS
	cors: {
		credentials: true,
		origin: [
			process.env.CLIENT_URL,
			process.env.LOCAL_CLIENT_URL
		].filter(Boolean) // Удаляем undefined значения
	},

	// JWT
	jwt: {
		accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
		refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
		accessTokenExpiration: '30m',
		refreshTokenExpiration: '15d'
	},

	// Cookie
	cookie: {
		refreshToken: {
			httpOnly: false,
			maxAge: 1296e6 // 15 дней
		}
	},

	// Socket.io
	socketIO: {
		cors: {
			origin: [
				process.env.CLIENT_URL,
				process.env.LOCAL_CLIENT_URL
			].filter(Boolean), // Удаляем undefined значения
			methods: ["GET", "POST"],
			credentials: true,
			allowedHeaders: ["Authorization", "Content-Type"]
		},
		// Дополнительные настройки Socket.io
		pingTimeout: 60000,
		pingInterval: 25000
	},

	// Email (SMTP)
	email: {
		smtp: {
			host: process.env.SMTP_HOST,
			port: parseInt(process.env.SMTP_PORT, 10) || 587,
			secure: process.env.SMTP_SECURE === 'true' || false, // true для 465, false для других портов
			user: process.env.SMTP_USER,
			password: process.env.SMTP_PASSWORD
		},
		fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
		fromName: process.env.SMTP_FROM_NAME || 'Система',
		frontendUrl: process.env.FRONTEND_URL || process.env.CLIENT_URL
	},

	// reCaptcha
	recaptcha: {
		secretKey: process.env.RECAPTCHA_SECRET_KEY
	}
};

export default config;
