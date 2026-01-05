import mongoose from 'mongoose';
import { List } from '../models/list.js'

class ListRepository {


	static async createList(list) {
		const newList = await new List(list)
		const response = newList
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

	static async getOneList(id, workspaceId) {
		const query = { _id: id };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await List
			.findOne(query)
			.then((list) => {
				return list
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllListsByUser(id, workspaceId) {
		const query = { userId: id };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await List
			.find(query)
			.then((list) => {
				return list
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllLists(workspaceId) {
		const query = {};
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await List.find(query)
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
		if (!response) {
			return null;
		}
		return response
	}

	static async deleteList(id, workspaceId) {
		const query = { _id: id };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		await List
			.deleteOne(query)
	}

	static async updateList({ id, list }) {
		await List
			.updateOne({ _id: id }, { $set: list })
			.then((listRes) => {
				return listRes
			})
		const response = List
			.findOne({ _id: id })
			.then((listRes) => {
				return listRes
			})
		if (!response) {
			return null;
		}
		return response
	}
}

export default ListRepository;
