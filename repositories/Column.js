import mongoose from 'mongoose';
import { Column } from '../models/column.js'

class ColumnRepository {


	static async create(column) {
		const newColumn = new Column(column)
		const response = await newColumn
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
		const response = await Column
			.findOne(query)
			.then((column) => {
				return column
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getOneByName(name, workspaceId) {
		const query = { name: name };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Column
			.findOne(query)
			.then((column) => {
				return column
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllByUser(id) {
		const response = await Column
			.find({ userId: id })
			.then((column) => {
				return column
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
		const response = await Column.find(query)
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
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
		await Column
			.deleteOne(query)
	}

	static async update({ id, column }) {
		await Column
			.updateOne({ _id: id }, { $set: column })
			.then((columnRes) => {
				return columnRes
			})
		const response = Column
			.findOne({ _id: id })
			.then((columnRes) => {
				return columnRes
			})
		if (!response) {
			return null;
		}
		return response
	}
}

export default ColumnRepository;
