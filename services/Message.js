import MessageRepository from '../repositories/Message.js';
import { Conflict } from '../utils/Errors.js';

class MessageService {

	static async create(message) {
		const response = await MessageRepository.create(message)
		return response
	}

	static async getOne(id) {
		const response = await MessageRepository.getOne(id)
		return response
	}

	static async getAll(workspaceId) {
		const response = await MessageRepository.getAll(workspaceId)
		return response
	}

	static async getAllByRoom(room, workspaceId) {
		const response = await MessageRepository.getAllByRoom(room, workspaceId)
		return response
	}

	static async delete(id, workspaceId) {
		const messageData = await MessageRepository.getOne(id, workspaceId);
		if (!messageData) {
			throw new Conflict("Нет сообщения с таким ID");
		}
		await MessageRepository.delete(id, workspaceId)
	}

	static async update({ id, message, workspaceId }) {
		let updateMessage = message
		const messageData = await MessageRepository.getOne(id, workspaceId);
		if (!messageData) {
			throw new Conflict("Нет сообщения с таким ID");
		}

		const response = await MessageRepository.update({ id, message: updateMessage })
		return response
	}
}

export default MessageService