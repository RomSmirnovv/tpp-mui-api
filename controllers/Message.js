import MessageService from '../services/Message.js'
import ErrorsUtils from "../utils/Errors.js";

class MessageController {

	static async create(req, res) {
		const message = req.body
		try {
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
			const messages = await MessageService.getAll()
			return res.status(200).json(messages)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}


	static async getAllByRoom(req, res) {
		const { room } = req.params
		try {
			const messages = await MessageService.getAllByRoom(room)
			return res.status(200).json(messages)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async delete(req, res) {
		const { id } = req.params
		try {
			await MessageService.delete(id)
			return res.status(200).json(`Сообщение с id = ${id} удалено!`)
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async update(req, res) {
		const { id } = req.params
		const message = req.body
		try {
			const updateMessage = await MessageService.update({ id, message })
			return res.status(200).json(updateMessage);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default MessageController