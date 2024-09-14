import ColumnRepository from '../repositories/Column.js';
import ListRepository from '../repositories/List.js';
import { Conflict } from '../utils/Errors.js'

class ColumnService {

	static async create(column) {
		const columnData = await ColumnRepository.getOneByName(column.name);
		if (columnData) {
			throw new Conflict("Колонка с таким именем уже существует");
		}
		const response = await ColumnRepository.create(column)
		const lists = await ListRepository.getAllLists()
		for (let i = 0; i < lists.length; i++) {
			lists[i].columns.push({
				key: lists.length + 1,
				headerName: column.name,
				field: column.slug,
				width: 200,
				checked: false
			})
			ListRepository.updateList({ id: lists[i]._id, list: lists[i] })
		}
		return response
	}

	static async getOne(id) {
		const response = await ColumnRepository.getOne(id)
		return response
	}

	static async getAllByUser(userId) {
		const response = await ColumnRepository.getAllByUser(userId)
		return response
	}

	static async getAll() {
		const response = await ColumnRepository.getAll()
		return response
	}

	static async delete(id) {
		const columnData = await ColumnRepository.getOne(id);
		if (!columnData) {
			throw new Conflict("Нет колонки с таким ID");
		}
		await ColumnRepository.delete(id)
	}

	static async update({ id, column }) {
		const columnData = await ColumnRepository.getOne(id);
		if (!columnData) {
			throw new Conflict("Нет колонки с таким ID");
		}

		const response = await ColumnRepository.update({ id, column })
		return response
	}
}

export default ColumnService