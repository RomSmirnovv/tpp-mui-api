import WorkspaceRepository from '../repositories/Workspace.js';
import UserRepository from '../repositories/User.js';
import ListService from './List.js';
import ColumnRepository from '../repositories/Column.js';
import { Conflict, NotFound } from '../utils/Errors.js';
import bcrypt from 'bcryptjs';
import moment from 'moment/moment.js';

class WorkspaceService {
	/**
	 * Регистрация нового workspace (компании) с созданием администратора
	 * 
	 * Порядок создания:
	 * 1. Создается workspace (рабочее пространство)
	 * 2. Создается пользователь (user) с workspaceId
	 * 3. Все будущие данные компании (Company) будут содержать workspaceId
	 */
	static async registerWorkspace({
		// Данные компании
		companyName,
		logo,
		colors,
		email,
		phone,
		employeesCount,
		// Данные администратора
		adminName,
		adminSurname,
		adminPatronymic,
		adminRole,
		adminBirthDate,
		adminLogin,
		adminPassword
	}) {
		// Проверка, что workspace с таким email не существует
		const existingWorkspace = await WorkspaceRepository.getWorkspaceByEmail(email);
		if (existingWorkspace) {
			throw new Conflict('Компания с таким email уже зарегистрирована');
		}

		// Проверка, что пользователь с таким логином не существует
		const existingUser = await UserRepository.getUserData(adminLogin);
		if (existingUser) {
			throw new Conflict('Пользователь с таким логином уже существует');
		}

		// Валидация цветов
		if (colors && colors.length > 3) {
			throw new Conflict('Максимум 3 цвета');
		}

		// ШАГ 1: Создание workspace (рабочего пространства)
		const workspaceData = {
			name: companyName,
			logo: logo || '',
			colors: colors || [],
			email: email.toLowerCase().trim(),
			phone: phone.trim(),
			employeesCount: employeesCount || 1
		};

		const workspace = await WorkspaceRepository.createWorkspace(workspaceData);
		
		if (!workspace) {
			throw new Error('Не удалось создать workspace');
		}

		// ШАГ 2: Создание пользователя (user) с workspaceId
		const hashedPassword = bcrypt.hashSync(adminPassword, 8);
		const birthDateFormatted = adminBirthDate ? moment(adminBirthDate).format('DD.MM.YYYY') : '';

		const adminData = {
			name: adminName,
			surname: adminSurname,
			patronymic: adminPatronymic || '',
			phone: phone,
			birthDate: birthDateFormatted,
			login: adminLogin,
			hashedPassword: hashedPassword,
			role: 2, // Роль admin (2)
			workspaceId: workspace._id // Привязка пользователя к workspace
		};

		const admin = await UserRepository.createUser(adminData);

		if (!admin) {
			// Если не удалось создать админа, удаляем workspace
			await WorkspaceRepository.deleteWorkspace(workspace._id);
			throw new Error('Не удалось создать администратора');
		}

		// Создание колонок по умолчанию для workspace
		const defaultColumns = [
			{
				name: 'Название',
				slug: 'name',
				type: 'string',
				isDeleted: false,
				workspaceId: workspace._id
			},
			{
				name: 'Email',
				slug: 'email',
				type: 'string',
				isDeleted: false,
				workspaceId: workspace._id
			},
			{
				name: 'Телефон',
				slug: 'phone',
				type: 'string',
				isDeleted: false,
				workspaceId: workspace._id
			},
			{
				name: 'Цвет',
				slug: 'color',
				type: 'string',
				isDeleted: false,
				workspaceId: workspace._id
			}
		];

		for (const column of defaultColumns) {
			await ColumnRepository.create(column);
		}

		// Создание начальных списков для админа
		if (admin) {
			const add_lists = [
				{
					name: 'Основной',
					checked: true,
					userId: admin._id,
					order: 0,
					workspaceId: workspace._id
				},
				{
					name: 'Корзина',
					checked: false,
					userId: admin._id,
					order: 9999,
					workspaceId: workspace._id
				}
			];
			
			for (let n = 0; n < add_lists.length; n++) {
				await ListService.createList(add_lists[n]);
			}

			// Отправка email для подтверждения
			try {
				const EmailVerificationService = (await import('./EmailVerification.js')).default;
				const userName = `${adminName} ${adminSurname}`.trim();
				console.log('📧 Отправка email подтверждения:', {
					userId: admin._id.toString(),
					email: workspace.email,
					userName: userName
				});
				await EmailVerificationService.createAndSendToken(
					admin._id.toString(),
					workspace.email,
					userName
				);
				console.log('✅ Email подтверждения отправлен успешно');
			} catch (emailError) {
				console.error('❌ Ошибка при отправке email подтверждения:', emailError);
				console.error('Детали ошибки:', {
					message: emailError.message,
					stack: emailError.stack
				});
				// Не прерываем регистрацию, если email не отправился
				// Пользователь сможет запросить повторную отправку
			}
		}

		return {
			workspace,
			admin: {
				_id: admin._id,
				name: admin.name,
				surname: admin.surname,
				login: admin.login,
				role: admin.role,
				isEmailVerified: admin.isEmailVerified || false
			}
		};
	}

	/**
	 * Получить workspace по ID с данными администратора
	 */
	static async getWorkspaceById(_id) {
		const workspace = await WorkspaceRepository.getWorkspaceById(_id);
		if (!workspace) {
			throw new NotFound('Workspace не найден');
		}

		// Получаем администратора workspace (роль 2)
		const { User } = await import('../models/user.js');
		const admin = await User.findOne({ 
			workspaceId: _id, 
			role: 2 
		});

		return {
			...workspace.toObject(),
			admin: admin ? {
				_id: admin._id,
				name: admin.name,
				surname: admin.surname,
				patronymic: admin.patronymic || '',
				role: admin.role,
				birthDate: admin.birthDate || ''
			} : null
		};
	}

	/**
	 * Обновить workspace и данные администратора
	 */
	static async updateWorkspace(_id, updateData) {
		const workspace = await WorkspaceRepository.getWorkspaceById(_id);
		if (!workspace) {
			throw new NotFound('Workspace не найден');
		}

		// Если обновляется email, проверяем уникальность
		if (updateData.email && updateData.email !== workspace.email) {
			const existingWorkspace = await WorkspaceRepository.getWorkspaceByEmail(updateData.email);
			if (existingWorkspace) {
				throw new Conflict('Компания с таким email уже существует');
			}
		}

		// Валидация цветов
		if (updateData.colors && updateData.colors.length > 3) {
			throw new Conflict('Максимум 3 цвета');
		}

		// Подготовка данных для обновления workspace
		const workspaceUpdateData = {
			name: updateData.name,
			// Если logo явно передан (включая пустую строку для удаления), используем его
			// Если logo не передан (undefined), сохраняем текущий
			logo: updateData.hasOwnProperty('logo') ? updateData.logo : workspace.logo,
			colors: updateData.colors,
			email: updateData.email,
			phone: updateData.phone,
			employeesCount: updateData.employeesCount,
			columns: updateData.columns
		};

		// Удаляем undefined значения
		Object.keys(workspaceUpdateData).forEach(key => {
			if (workspaceUpdateData[key] === undefined) {
				delete workspaceUpdateData[key];
			}
		});

		const updatedWorkspace = await WorkspaceRepository.updateWorkspace(_id, workspaceUpdateData);

		// Обновление данных администратора, если они переданы
		if (updateData.adminId && (updateData.adminName || updateData.adminSurname || updateData.adminPatronymic || updateData.adminRole || updateData.adminBirthDate)) {
			const adminUpdateData = {};
			
			if (updateData.adminName) adminUpdateData.name = updateData.adminName;
			if (updateData.adminSurname) adminUpdateData.surname = updateData.adminSurname;
			if (updateData.adminPatronymic !== undefined) adminUpdateData.patronymic = updateData.adminPatronymic || '';
			if (updateData.adminRole) adminUpdateData.role = parseInt(updateData.adminRole);
			if (updateData.adminBirthDate) {
				adminUpdateData.birthDate = moment(updateData.adminBirthDate).format('DD.MM.YYYY');
			}

			if (Object.keys(adminUpdateData).length > 0) {
				const admin = await UserRepository.getUserById(updateData.adminId);
				if (admin) {
					await UserRepository.updateUser({ ...admin.toObject(), ...adminUpdateData });
				}
			}
		}

		return updatedWorkspace;
	}

	/**
	 * Получить workspace по userId
	 */
	static async getWorkspaceByUserId(userId) {
		const workspace = await WorkspaceRepository.getWorkspaceByUserId(userId);
		if (!workspace) {
			throw new NotFound('Workspace не найден для данного пользователя');
		}
		return workspace;
	}
}

export default WorkspaceService;
