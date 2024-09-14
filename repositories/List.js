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

	static async getOneList(id) {
		const response = await List
			.findOne({ _id: id })
			.then((list) => {
				return list
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllListsByUser(id) {
		const response = await List
			.find({ userId: id })
			.then((list) => {
				return list
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllLists() {
		const response = await List.find()
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
		if (!response) {
			return null;
		}
		return response
	}

	static async deleteList(id) {
		await List
			.deleteOne({ _id: id })
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
