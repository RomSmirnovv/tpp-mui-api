import mongoose from 'mongoose';
import config from '../config/env.js';
import { Company } from '../models/company.js';

const DB_URL = config.database.url;

// Маппинг старых hex кодов на индексы
const colorMapping = {
	'#ef7575': 0,  // Красный -> индекс 0
	'#ffe51d': 1,  // Желтый -> индекс 1
	'#84d166': 2   // Зеленый -> индекс 2
};

async function convertColorsToIndexes() {
	try {
		// Подключаемся к MongoDB
		console.log('🔌 Подключение к базе данных...');
		await mongoose.connect(DB_URL);
		console.log('✅ Подключено к MongoDB');

		// Находим все компании с hex кодами цветов
		const companies = await Company.find({
			color: { $in: Object.keys(colorMapping) }
		});

		console.log(`📊 Найдено ${companies.length} компаний с hex кодами цветов`);

		let updated = 0;
		for (const company of companies) {
			const colorIndex = colorMapping[company.color];
			if (colorIndex !== undefined) {
				company.color = colorIndex;
				await company.save();
				updated++;
			}
		}

		console.log(`✅ Обновлено ${updated} компаний`);
		console.log('✅ Миграция завершена успешно');

		await mongoose.disconnect();
		process.exit(0);
	} catch (error) {
		console.error('❌ Ошибка при выполнении миграции:', error);
		await mongoose.disconnect();
		process.exit(1);
	}
}

// Запускаем миграцию
convertColorsToIndexes();
