import ListService from '../services/List.js'
import ErrorsUtils from "../utils/Errors.js";
import { getWorkspaceIdFromRequest } from '../utils/getWorkspaceId.js';

class ListController {

	static async createList(req, res) {
		const list = req.body
		try {
			// Получаем workspaceId из запроса
			const workspaceId = await getWorkspaceIdFromRequest(req);
			if (workspaceId) {
				list.workspaceId = workspaceId;
			}
			const newList = await ListService.createList(list)
			return res.status(200).json(newList);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async getOneList(req, res) {
		const { id } = req.params
		try {
			const list = await ListService.getOneList(id)
			return res.status(200).json(list);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}


	static async getAllLists(req, res) {
		try {
			// Получаем workspaceId из запроса для фильтрации
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const lists = await ListService.getAllLists(workspaceId)
			return res.status(200).json(lists)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async getListsByUser(req, res) {
		const { userId } = req.params
		try {
			// Получаем workspaceId из запроса для фильтрации
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const lists = await ListService.getListsByUser(userId, workspaceId)
			return res.status(200).json(lists)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async deleteList(req, res) {
		const { id } = req.params
		try {
			// Получаем workspaceId из запроса для проверки принадлежности
			const workspaceId = await getWorkspaceIdFromRequest(req);
			await ListService.delete(id, workspaceId)
			return res.status(200).json(`Лист с id = ${id} удален!`)
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async updateList(req, res) {
		const list = req.body
		const id = list._id
		try {
			// Получаем workspaceId из запроса для проверки принадлежности
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const updateList = await ListService.update({ id, list, workspaceId })
			return res.status(200).json(updateList);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default ListController