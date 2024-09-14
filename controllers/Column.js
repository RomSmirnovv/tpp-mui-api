import ColumnService from '../services/Column.js'
import ErrorsUtils from "../utils/Errors.js";

class ColumnController {

	static async create(req, res) {
		const column = req.body
		try {
			const newColumn = await ColumnService.create(column)
			return res.status(200).json(newColumn);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async getOne(req, res) {
		const { id } = req.params
		try {
			const column = await ColumnService.getOne(id)
			return res.status(200).json(column);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}


	static async getAll(req, res) {
		try {
			const columns = await ColumnService.getAll()
			return res.status(200).json(columns)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}


	static async getAllByUser(req, res) {
		const { userId } = req.params
		try {
			const columns = await ColumnService.getAllByUser(userId)
			return res.status(200).json(columns)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async delete(req, res) {
		const { id } = req.params
		try {
			await ColumnService.delete(id)
			return res.status(200).json(`Колонка с id = ${id} удалена!`)
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async update(req, res) {
		const { id } = req.params
		const column = req.body
		try {
			const updateColumn = await ColumnService.update({ id, column })
			return res.status(200).json(updateColumn);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default ColumnController