import WorkspaceService from '../services/Workspace.js';
import ErrorsUtils from '../utils/Errors.js';
import { getLogoUrl } from '../utils/upload.js';

class WorkspaceController {
	/**
	 * Регистрация нового workspace (компании)
	 * POST /workspace/register
	 */
	static async register(req, res) {
		try {
			const {
				companyName,
				colors,
				email,
				phone,
				employeesCount,
				adminName,
				adminSurname,
				adminPatronymic,
				adminRole,
				adminBirthDate,
				adminLogin,
				adminPassword,
				recaptchaToken
			} = req.body;

			// Отладка: проверяем, что recaptchaToken получен
			console.log('recaptchaToken получен:', recaptchaToken ? 'да' : 'нет');
			if (!recaptchaToken) {
				console.log('req.body keys:', Object.keys(req.body));
				console.log('req.body:', JSON.stringify(req.body, null, 2));
			}

			// Проверка reCaptcha
			const { verifyRecaptcha } = await import('../utils/recaptcha.js');
			const recaptchaResult = await verifyRecaptcha(recaptchaToken);
			
			if (!recaptchaResult.success && !recaptchaResult.skip) {
				return res.status(400).json({
					message: 'Проверка reCaptcha не пройдена',
					error: recaptchaResult.error
				});
			}

			// Получаем путь к логотипу, если он был загружен
			const logo = req.file ? getLogoUrl(req.file.filename) : '';

			const result = await WorkspaceService.registerWorkspace({
				companyName,
				logo,
				colors: Array.isArray(colors) ? colors : (colors ? [colors] : []),
				email,
				phone,
				employeesCount: parseInt(employeesCount) || 1,
				adminName,
				adminSurname,
				adminPatronymic,
				adminRole,
				adminBirthDate,
				adminLogin,
				adminPassword
			});

			return res.status(201).json({
				message: 'Компания успешно зарегистрирована',
				workspace: {
					_id: result.workspace._id,
					name: result.workspace.name,
					logo: result.workspace.logo,
					colors: result.workspace.colors,
					email: result.workspace.email
				},
				admin: result.admin
			});
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	/**
	 * Получить workspace по ID
	 * GET /workspace/:id
	 */
	static async getWorkspace(req, res) {
		try {
			const { id } = req.params;
			const workspace = await WorkspaceService.getWorkspaceById(id);
			return res.status(200).json(workspace);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	/**
	 * Получить workspace по userId
	 * GET /workspace/user/:userId
	 */
	static async getWorkspaceByUserId(req, res) {
		try {
			const { userId } = req.params;
			const workspace = await WorkspaceService.getWorkspaceByUserId(userId);
			return res.status(200).json(workspace);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	/**
	 * Обновить workspace
	 * PUT /workspace/:id
	 */
	static async updateWorkspace(req, res) {
		try {
			const { id } = req.params;
			const updateData = { ...req.body };

			// Если нужно удалить логотип
			if (updateData.removeLogo === 'true' || updateData.removeLogo === true) {
				updateData.logo = ''; // Устанавливаем пустую строку для удаления
				delete updateData.removeLogo; // Удаляем флаг из данных
			}
			// Если загружен новый логотип
			else if (req.file) {
				updateData.logo = getLogoUrl(req.file.filename);
			}
			// Если логотип не передан и не удаляется, не трогаем его (не добавляем в updateData)
			else if (!updateData.hasOwnProperty('logo')) {
				// Не добавляем logo в updateData, чтобы сохранить текущий
			}

			// Обработка цветов
			if (updateData.colors) {
				updateData.colors = Array.isArray(updateData.colors) 
					? updateData.colors 
					: (updateData.colors ? [updateData.colors] : []);
			}

			// Обработка колонок
			if (updateData.columns) {
				updateData.columns = Array.isArray(updateData.columns) 
					? updateData.columns 
					: (updateData.columns ? [updateData.columns] : []);
			}

			// Преобразование employeesCount в число
			if (updateData.employeesCount) {
				updateData.employeesCount = parseInt(updateData.employeesCount) || 1;
			}

			const workspace = await WorkspaceService.updateWorkspace(id, updateData);
			return res.status(200).json({
				message: 'Workspace успешно обновлен',
				workspace
			});
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default WorkspaceController;
