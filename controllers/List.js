import ListService from '../services/List.js'
import ErrorsUtils from "../utils/Errors.js";

class ListController {

	static async createList(req, res) {
		const list = req.body
		try {
			const newList = await ListService.createList(list)
			return res.status(200).json(newList);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async getOneList(req, res) {
		const { id } = req.params
		try {
			const list = await ListService.getOneList(id)
			return res.status(200).json(list);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}


	static async getAllLists(req, res) {
		try {
			const lists = await ListService.getAllLists()
			return res.status(200).json(lists)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async getListsByUser(req, res) {
		const { userId } = req.params
		try {
			const lists = await ListService.getListsByUser(userId)
			return res.status(200).json(lists)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async deleteList(req, res) {
		const { id } = req.params
		try {
			await ListService.delete(id)
			return res.status(200).json(`Лист с id = ${id} удален!`)
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async updateList(req, res) {
		const list = req.body
		const id = list._id
		try {
			const updateList = await ListService.update({ id, list })
			return res.status(200).json(updateList);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default ListController