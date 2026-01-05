/**
 * Вспомогательные функции для обновления workspaceId в запросах
 */

/**
 * Добавить workspaceId к запросу поиска
 * @param {Object} baseQuery - Базовый запрос
 * @param {string|null} workspaceId - workspaceId для фильтрации
 * @returns {Object} - Обновленный запрос
 */
export function addWorkspaceIdToQuery(baseQuery, workspaceId) {
	if (workspaceId) {
		baseQuery.workspaceId = workspaceId;
	}
	return baseQuery;
}

/**
 * Добавить workspaceId к данным для создания
 * @param {Object} data - Данные для создания
 * @param {string|null} workspaceId - workspaceId
 * @returns {Object} - Обновленные данные
 */
export function addWorkspaceIdToData(data, workspaceId) {
	if (workspaceId && !data.workspaceId) {
		data.workspaceId = workspaceId;
	}
	return data;
}
