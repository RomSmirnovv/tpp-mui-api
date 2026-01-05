/**
 * Утилита для валидации переменных окружения
 * Проверяет наличие всех обязательных переменных при старте приложения
 */

class EnvValidator {
	/**
	 * Обязательные переменные окружения
	 */
	static REQUIRED_VARS = {
		DB_URL: {
			description: 'URL подключения к MongoDB',
			example: 'mongodb://localhost:27017/smtppapp'
		},
		ACCESS_TOKEN_SECRET: {
			description: 'Секретный ключ для Access Token',
			example: 'Используйте: openssl rand -base64 32'
		},
		REFRESH_TOKEN_SECRET: {
			description: 'Секретный ключ для Refresh Token',
			example: 'Используйте: openssl rand -base64 32'
		},
		CLIENT_URL: {
			description: 'URL клиентского приложения (для CORS)',
			example: 'http://localhost:5173'
		},
		SMTP_HOST: {
			description: 'SMTP сервер для отправки email',
			example: 'smtp.gmail.com или smtp.yandex.ru'
		},
		SMTP_PORT: {
			description: 'Порт SMTP сервера',
			example: '587 (TLS) или 465 (SSL)'
		},
		SMTP_USER: {
			description: 'Логин для SMTP (обычно email)',
			example: 'your-email@gmail.com'
		},
		SMTP_PASSWORD: {
			description: 'Пароль для SMTP (может быть пароль приложения)',
			example: 'your-password или app-password'
		},
		RECAPTCHA_SECRET_KEY: {
			description: 'Секретный ключ для Google reCaptcha v3',
			example: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
		},
		FRONTEND_URL: {
			description: 'URL фронтенда для ссылок подтверждения email',
			example: 'http://localhost:5173'
		}
	};

	/**
	 * Опциональные переменные с значениями по умолчанию
	 */
	static OPTIONAL_VARS = {
		PORT: {
			default: 5000,
			description: 'Порт сервера'
		},
		LOCAL_CLIENT_URL: {
			default: null,
			description: 'URL локального клиента (для разработки)'
		},
		SMTP_FROM_EMAIL: {
			default: null,
			description: 'Email отправителя (если отличается от SMTP_USER)'
		},
		SMTP_FROM_NAME: {
			default: 'Система',
			description: 'Имя отправителя в письмах'
		},
		SMTP_SECURE: {
			default: 'false',
			description: 'Использовать SSL (true для порта 465, false для 587)'
		}
	};

	/**
	 * Валидация переменных окружения
	 * @returns {Object} Результат валидации { isValid: boolean, errors: string[] }
	 */
	static validate() {
		const errors = [];
		const warnings = [];

		// Проверка обязательных переменных
		for (const [varName, config] of Object.entries(this.REQUIRED_VARS)) {
			const value = process.env[varName];

			if (!value || value.trim() === '') {
				errors.push(
					`❌ ${varName} - обязательная переменная не установлена\n` +
					`   Описание: ${config.description}\n` +
					`   Пример: ${config.example}`
				);
			} else {
				// Дополнительные проверки
				if (varName.includes('SECRET') && value.length < 32) {
					warnings.push(
						`⚠️  ${varName} - слишком короткий ключ (рекомендуется минимум 32 символа)`
					);
				}

				if (varName === 'DB_URL' && !value.startsWith('mongodb://') && !value.startsWith('mongodb+srv://')) {
					warnings.push(
						`⚠️  ${varName} - неверный формат URL MongoDB (должен начинаться с mongodb:// или mongodb+srv://)`
					);
				}
			}
		}

		// Проверка опциональных переменных
		for (const [varName, config] of Object.entries(this.OPTIONAL_VARS)) {
			if (!process.env[varName] && config.default !== null) {
				process.env[varName] = String(config.default);
			}
		}

		// Проверка на одинаковые секретные ключи
		if (
			process.env.ACCESS_TOKEN_SECRET &&
			process.env.REFRESH_TOKEN_SECRET &&
			process.env.ACCESS_TOKEN_SECRET === process.env.REFRESH_TOKEN_SECRET
		) {
			errors.push(
				'❌ ACCESS_TOKEN_SECRET и REFRESH_TOKEN_SECRET не должны быть одинаковыми!'
			);
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings
		};
	}

	/**
	 * Вывод результатов валидации
	 * @param {Object} result - Результат валидации
	 */
	static printResults(result) {
		if (result.warnings.length > 0) {
			console.log('\n⚠️  Предупреждения:');
			result.warnings.forEach(warning => console.log(warning));
		}

		if (result.errors.length > 0) {
			console.log('\n❌ Ошибки конфигурации:');
			result.errors.forEach(error => console.log(error));
			console.log('\n📝 Создайте файл .env на основе .env.example и заполните все обязательные переменные.\n');
			return false;
		}

		if (result.warnings.length === 0) {
			console.log('✅ Все переменные окружения настроены корректно\n');
		}

		return true;
	}

	/**
	 * Получить список всех переменных (для отладки, без значений)
	 */
	static getEnvSummary() {
		const summary = {
			required: {},
			optional: {}
		};

		for (const varName of Object.keys(this.REQUIRED_VARS)) {
			summary.required[varName] = process.env[varName] ? '✓ установлено' : '✗ не установлено';
		}

		for (const varName of Object.keys(this.OPTIONAL_VARS)) {
			summary.optional[varName] = process.env[varName] || `по умолчанию: ${this.OPTIONAL_VARS[varName].default}`;
		}

		return summary;
	}
}

export default EnvValidator;
