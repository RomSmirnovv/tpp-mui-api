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

	static async getOne(id) {
		const response = await Column
			.findOne({ _id: id })
			.then((column) => {
				return column
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getOneByName(name) {
		const response = await Column
			.findOne({ name: name })
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

	static async getAll() {
		const response = await Column.find()
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
		if (!response) {
			return null;
		}
		return response
	}

	static async delete(id) {
		await Column
			.deleteOne({ _id: id })
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
