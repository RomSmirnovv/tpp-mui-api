import MessageRepository from '../repositories/Message.js';

class MessageService {

	static async create(message) {
		const response = await MessageRepository.create(message)
		return response
	}

	static async getOne(id) {
		const response = await MessageRepository.getOne(id)
		return response
	}

	static async getAll() {
		const response = await MessageRepository.getAll()
		return response
	}

	static async getAllByRoom(room) {
		const response = await MessageRepository.getAllByRoom(room)
		return response
	}

	static async delete(id) {
		const messageData = await MessageRepository.getOne(id);
		if (!messageData) {
			throw new Conflict("Нет сообщения с таким ID");
		}
		await MessageRepository.delete(id)
	}

	static async update({ id, message }) {
		let updateMessage = message
		const messageData = await MessageRepository.getOne(id);
		if (!messageData) {
			throw new Conflict("Нет сообщения с таким ID");
		}

		const response = await MessageRepository.update({ id, message: updateMessage })
		return response
	}
}

export default MessageService