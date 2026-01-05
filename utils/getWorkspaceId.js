import AuthService from '../services/Auth.js';

/**
 * Получить workspaceId из запроса
 * @param {Object} req - Express request object
 * @returns {Promise<string|null>} - workspaceId или null
 */
export async function getWorkspaceIdFromRequest(req) {
	try {
		const currentRefreshToken = req.cookies?.refreshToken;
		const { fingerprint } = req;

		if (!currentRefreshToken) {
			return null;
		}

		const user = await AuthService.getUserByToken({ currentRefreshToken, fingerprint });
		
		if (!user || !user.workspaceId) {
			return null;
		}

		// Если workspaceId - объект, преобразуем в строку
		if (typeof user.workspaceId === 'object') {
			return user.workspaceId._id || user.workspaceId.toString();
		}

		return user.workspaceId.toString();
	} catch (error) {
		console.error('Error getting workspaceId from request:', error);
		return null;
	}
}

/**
 * Получить пользователя из запроса
 * @param {Object} req - Express request object
 * @returns {Promise<Object|null>} - User object или null
 */
export async function getUserFromRequest(req) {
	try {
		const currentRefreshToken = req.cookies?.refreshToken;
		const { fingerprint } = req;

		if (!currentRefreshToken) {
			return null;
		}

		return await AuthService.getUserByToken({ currentRefreshToken, fingerprint });
	} catch (error) {
		console.error('Error getting user from request:', error);
		return null;
	}
}
