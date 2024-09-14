import mongoose from 'mongoose';
import { Message } from '../models/message.js'

class MessageRepository {


	static async create(message) {
		const newMessage = await new Message(message)
		const response = newMessage
			.save()
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
		if (!response) {
			return null;
		}
		return response

	}

	static async getOne(id) {
		const response = await Message
			.findOne({ _id: id })
			.then((message) => {
				return message
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAll() {
		const response = await Message
			.find()
			.then((message) => {
				return message
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllByRoom(room) {
		const response = await Message
			.find({ room })
			.then((message) => {
				return message
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async delete(id) {
		await Message
			.deleteOne({ _id: id })
	}


	static async update({ id, message }) {
		await Message
			.updateOne({ _id: id }, { $set: message })
			.then((messageRes) => {
				return messageRes
			})
		const response = Message
			.findOne({ _id: id })
			.then((messageRes) => {
				return messageRes
			})
		if (!response) {
			return null;
		}
		return response
	}
}

export default MessageRepository;
