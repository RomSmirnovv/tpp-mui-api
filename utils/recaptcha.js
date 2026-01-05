import config from '../config/env.js';

/**
 * Проверка reCaptcha v3 токена
 * @param {string} token - Токен от Google reCaptcha
 * @returns {Promise<Object>} Результат проверки
 */
export async function verifyRecaptcha(token) {
	// Если RECAPTCHA_SECRET_KEY не установлен, пропускаем проверку
	if (!config.recaptcha.secretKey) {
		console.warn('⚠️  RECAPTCHA_SECRET_KEY не установлен, пропускаем проверку');
		return {
			success: true,
			skip: true
		};
	}

	// Если токен не предоставлен, возвращаем ошибку
	if (!token || token === '') {
		return {
			success: false,
			error: 'Токен reCaptcha не предоставлен'
		};
	}

	if (!config.recaptcha.secretKey) {
		console.warn('⚠️  RECAPTCHA_SECRET_KEY не установлен, пропускаем проверку');
		return {
			success: true,
			skip: true
		};
	}

	try {
		const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				secret: config.recaptcha.secretKey,
				response: token
			})
		});

		const data = await response.json();

		if (!data.success) {
			return {
				success: false,
				error: 'Проверка reCaptcha не пройдена',
				errors: data['error-codes'] || []
			};
		}

		// Проверяем score (для v3, должен быть >= 0.5)
		if (data.score !== undefined && data.score < 0.5) {
			return {
				success: false,
				error: 'Низкий score reCaptcha (возможно, бот)',
				score: data.score
			};
		}

		return {
			success: true,
			score: data.score,
			action: data.action
		};
	} catch (error) {
		console.error('Ошибка при проверке reCaptcha:', error);
		return {
			success: false,
			error: 'Ошибка при проверке reCaptcha'
		};
	}
}
