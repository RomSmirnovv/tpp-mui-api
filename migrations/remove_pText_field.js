/**
 * Миграция для удаления поля pText из всех пользователей в базе данных
 * 
 * ВАЖНО: Это поле содержало пароли в открытом виде, что является критической уязвимостью безопасности.
 * 
 * Запуск:
 * node migrations/remove_pText_field.js
 * 
 * Или через MongoDB shell:
 * db.users.updateMany({}, { $unset: { pText: "" } })
 */

import mongoose from 'mongoose';
import config from '../config/env.js';
import { User } from '../models/user.js';

const DB_URL = config.database.url;

if (!DB_URL) {
	console.error('❌ Ошибка: DB_URL не установлен в переменных окружения');
	process.exit(1);
}

async function removePTextField() {
	try {
		console.log('🔌 Подключение к базе данных...');
		await mongoose.connect(DB_URL);
		console.log('✅ Подключено к MongoDB');

		console.log('🔍 Поиск пользователей с полем pText...');
		const usersWithPText = await User.find({ pText: { $exists: true, $ne: null } });
		const count = usersWithPText.length;
		
		if (count === 0) {
			console.log('✅ Поле pText не найдено ни у одного пользователя');
			await mongoose.disconnect();
			return;
		}

		console.log(`⚠️  Найдено ${count} пользователей с полем pText`);
		console.log('🗑️  Удаление поля pText...');

		const result = await User.updateMany(
			{ pText: { $exists: true } },
			{ $unset: { pText: "" } }
		);

		console.log(`✅ Успешно удалено поле pText у ${result.modifiedCount} пользователей`);
		console.log('🔒 Безопасность улучшена: пароли больше не хранятся в открытом виде');

		await mongoose.disconnect();
		console.log('✅ Миграция завершена успешно');
	} catch (error) {
		console.error('❌ Ошибка при выполнении миграции:', error);
		await mongoose.disconnect();
		process.exit(1);
	}
}

// Запуск миграции
removePTextField();
