import mongoose from 'mongoose';
import config from '../config/env.js';
import { Company } from '../models/company.js';
import { Workspace } from '../models/workspace.js';

const DB_URL = config.database.url;

// Маппинг старых hex кодов на индексы
const oldColorMapping = {
	'#ef7575': 0,  // Красный -> индекс 0
	'#ffe51d': 1,  // Желтый -> индекс 1
	'#84d166': 2   // Зеленый -> индекс 2
};

async function fixAllCompanyColors() {
	try {
		// Подключаемся к MongoDB
		console.log('🔌 Подключение к базе данных...');
		await mongoose.connect(DB_URL);
		console.log('✅ Подключено к MongoDB');

		// Получаем все компании
		const companies = await Company.find({});
		console.log(`📊 Найдено ${companies.length} компаний в базе`);

		// Получаем все workspace для получения цветов
		const workspaces = await Workspace.find({});
		console.log(`📊 Найдено ${workspaces.length} workspace`);

		// Создаем маппинг workspaceId -> colors
		const workspaceColorsMap = {};
		workspaces.forEach(ws => {
			if (ws._id) {
				workspaceColorsMap[ws._id.toString()] = ws.colors || [];
			}
		});

		let updated = 0;
		let skipped = 0;
		let errors = 0;

		for (const company of companies) {
			try {
				const currentColor = company.color;
				
				// Если цвет пустой, пропускаем
				if (!currentColor || currentColor === '') {
					skipped++;
					continue;
				}

				let newColor = null;
				let reason = '';

				// Если это уже число (правильный формат)
				if (typeof currentColor === 'number') {
					// Проверяем, что число валидно (0, 1, 2)
					if (currentColor >= 0 && currentColor <= 2) {
						skipped++;
						continue; // Уже правильный формат
					} else {
						// Неправильное число, сбрасываем
						newColor = '';
						reason = 'Invalid number (not 0-2)';
					}
				}
				// Если это строка-число ("0", "1", "2")
				else if (typeof currentColor === 'string') {
					const numValue = Number(currentColor);
					if (!isNaN(numValue) && numValue >= 0 && numValue <= 2) {
						// Конвертируем строку в число
						newColor = numValue;
						reason = 'String number converted to number';
					}
					// Если это старый hex код
					else if (oldColorMapping[currentColor]) {
						newColor = oldColorMapping[currentColor];
						reason = 'Old hex code converted to index';
					}
					// Если это новый hex код из workspace
					else if (currentColor.startsWith('#')) {
						// Пытаемся найти цвет в workspace
						const workspaceId = company.workspaceId?.toString();
						const workspaceColors = workspaceColorsMap[workspaceId] || [];
						
						const colorIndex = workspaceColors.findIndex(c => c === currentColor);
						if (colorIndex !== -1) {
							newColor = colorIndex;
							reason = 'Workspace color converted to index';
						} else {
							// Цвет не найден в workspace, сбрасываем
							newColor = '';
							reason = 'Color not found in workspace, reset';
						}
					}
					// Неизвестный формат, сбрасываем
					else {
						newColor = '';
						reason = 'Unknown format, reset';
					}
				}
				// Неизвестный тип, сбрасываем
				else {
					newColor = '';
					reason = 'Unknown type, reset';
				}

				// Обновляем только если цвет изменился
				if (newColor !== null && newColor !== currentColor) {
					company.color = newColor;
					await company.save();
					updated++;
					
					if (updated % 100 === 0) {
						console.log(`  ⏳ Обновлено ${updated} компаний...`);
					}
				} else {
					skipped++;
				}
			} catch (error) {
				console.error(`❌ Ошибка при обработке компании ${company._id}:`, error.message);
				errors++;
			}
		}

		console.log('\n📊 Результаты миграции:');
		console.log(`  ✅ Обновлено: ${updated} компаний`);
		console.log(`  ⏭️  Пропущено (уже правильный формат): ${skipped} компаний`);
		console.log(`  ❌ Ошибок: ${errors} компаний`);
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
fixAllCompanyColors();
