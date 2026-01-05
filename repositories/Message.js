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

	static async getOne(id, workspaceId) {
		const query = { _id: id };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Message
			.findOne(query)
			.then((message) => {
				return message
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAll(workspaceId) {
		const query = {};
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Message
			.find(query)
			.then((message) => {
				return message
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllByRoom(room, workspaceId) {
		const query = { room };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Message
			.find(query)
			.then((message) => {
				return message
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async delete(id, workspaceId) {
		const query = { _id: id };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		await Message
			.deleteOne(query)
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
