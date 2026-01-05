/**
 * Миграция для добавления workspaceId к существующим пользователям и компаниям
 * 
 * ВАЖНО: Эта миграция создает дефолтный workspace для существующих данных
 * 
 * Запуск:
 * node migrations/add_workspace_to_existing_data.js
 */

import mongoose from 'mongoose';
import config from '../config/env.js';
import { User } from '../models/user.js';
import { Company } from '../models/company.js';
import { Workspace } from '../models/workspace.js';

const DB_URL = config.database.url;

async function addWorkspaceToExistingData() {
	try {
		console.log('🔌 Подключение к базе данных...');
		await mongoose.connect(DB_URL);
		console.log('✅ Подключено к MongoDB');

		// Создаем дефолтный workspace для существующих данных
		console.log('🔍 Проверка существующих workspace...');
		let defaultWorkspace = await Workspace.findOne({ name: 'Default Workspace' });

		if (!defaultWorkspace) {
			console.log('📦 Создание дефолтного workspace...');
			defaultWorkspace = await Workspace.create({
				name: 'Default Workspace',
				email: 'default@workspace.local',
				phone: '',
				employeesCount: 0,
				colors: []
			});
			console.log(`✅ Создан дефолтный workspace: ${defaultWorkspace._id}`);
		} else {
			console.log(`✅ Дефолтный workspace уже существует: ${defaultWorkspace._id}`);
		}

		// Обновляем пользователей без workspaceId
		console.log('👥 Обновление пользователей...');
		const usersWithoutWorkspace = await User.find({ workspaceId: { $exists: false } });
		if (usersWithoutWorkspace.length > 0) {
			const result = await User.updateMany(
				{ workspaceId: { $exists: false } },
				{ $set: { workspaceId: defaultWorkspace._id } }
			);
			console.log(`✅ Обновлено ${result.modifiedCount} пользователей`);
		} else {
			console.log('✅ Все пользователи уже имеют workspaceId');
		}

		// Обновляем компании без workspaceId
		console.log('🏢 Обновление компаний...');
		const companiesWithoutWorkspace = await Company.find({ workspaceId: { $exists: false } });
		if (companiesWithoutWorkspace.length > 0) {
			const result = await Company.updateMany(
				{ workspaceId: { $exists: false } },
				{ $set: { workspaceId: defaultWorkspace._id } }
			);
			console.log(`✅ Обновлено ${result.modifiedCount} компаний`);
		} else {
			console.log('✅ Все компании уже имеют workspaceId');
		}

		await mongoose.disconnect();
		console.log('✅ Миграция завершена успешно');
	} catch (error) {
		console.error('❌ Ошибка при выполнении миграции:', error);
		await mongoose.disconnect();
		process.exit(1);
	}
}

// Запуск миграции
addWorkspaceToExistingData();
