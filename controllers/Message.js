import MessageService from '../services/Message.js'
import ErrorsUtils from "../utils/Errors.js";
import { getWorkspaceIdFromRequest } from '../utils/getWorkspaceId.js';

class MessageController {

	static async create(req, res) {
		const message = req.body
		try {
			// Получаем workspaceId из запроса
			const workspaceId = await getWorkspaceIdFromRequest(req);
			if (workspaceId) {
				message.workspaceId = workspaceId;
			}
			const newMessage = await MessageService.create(message)
			return res.status(200).json(newMessage);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async getOne(req, res) {
		const { id } = req.params
		try {
			const message = await MessageService.getOne(id)
			return res.status(200).json(message);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}


	static async getAll(req, res) {
		try {
			// Получаем workspaceId из запроса для фильтрации
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const messages = await MessageService.getAll(workspaceId)
			return res.status(200).json(messages)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}


	static async getAllByRoom(req, res) {
		const { room } = req.params
		try {
			// Получаем workspaceId из запроса для фильтрации
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const messages = await MessageService.getAllByRoom(room, workspaceId)
			return res.status(200).json(messages)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async delete(req, res) {
		const { id } = req.params
		try {
			// Получаем workspaceId из запроса для проверки принадлежности
			const workspaceId = await getWorkspaceIdFromRequest(req);
			await MessageService.delete(id, workspaceId)
			return res.status(200).json(`Сообщение с id = ${id} удалено!`)
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async update(req, res) {
		const { id } = req.params
		const message = req.body
		try {
			// Получаем workspaceId из запроса для проверки принадлежности
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const updateMessage = await MessageService.update({ id, message, workspaceId })
			return res.status(200).json(updateMessage);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default MessageController