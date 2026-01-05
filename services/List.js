import ListRepository from '../repositories/List.js';
import CompanyRepository from '../repositories/Company.js';
import { Conflict } from '../utils/Errors.js'
import ColumnRepository from '../repositories/Column.js';

class ListService {

	static async createList(list) {
		const allListsByUser = await ListRepository.getAllListsByUser(list.userId)
		if (allListsByUser.length > 0) {
			list.order = allListsByUser.length - 1
		}

		// проверяем выбран ли лист checked
		if (list.checked === true) {
			// получаем лист, который выбран до этого и меняем у него checked на false
			const listData = await ListRepository.getAllListsByUser(list.userId)
			const listCheckedData = listData.filter(l => l.checked === true)
			if (listCheckedData && listCheckedData.length > 0) {
				listCheckedData[0].checked = false
				await ListRepository.updateList({ id: listCheckedData[0]._id, list: listCheckedData[0] })
			}
		}
		// получаем все колонки в базе данных для текущего workspace
		const allColumns = await ColumnRepository.getAll(list.workspaceId);
		// формируем массив колонок для листа
		const columns = allColumns.map((column, i) => {
			return {
				key: i + 1,
				headerName: column.name,
				field: column.slug,
				width: 200,
				checked: column.slug === 'name' ? true : false
			}
		})
		// добавляем колонки в лист
		list.columns = columns
		// создаем лист в базе данных
		const response = await ListRepository.createList(list)
		return response
	}

	static async getOneList(id) {
		const response = await ListRepository.getOneList(id)
		return response
	}

	static async getAllLists(workspaceId) {
		const response = await ListRepository.getAllLists(workspaceId)
		return response
	}

	static async getListsByUser(userId, workspaceId) {
		const response = await ListRepository.getAllListsByUser(userId, workspaceId)
		return response.sort((a, b) => a.order - b.order);
	}

	static async delete(id, workspaceId) {
		const listData = await ListRepository.getOneList(id, workspaceId);
		if (!listData) {
			throw new Conflict("Нет листа с таким ID");
		}

		// проверяем выбран ли лист checked
		if (listData.checked === true) {
			// получаем первый лист пользователя и делаем его выбраным checked
			const listAllDataUser = await ListRepository.getAllListsByUser(listData.userId, workspaceId)
			if (listAllDataUser.length > 0) {
				listAllDataUser[0].checked = true
				await ListRepository.updateList({ id: listAllDataUser[0]._id, list: listAllDataUser[0] })
			}
		}
		await ListRepository.deleteList(id, workspaceId);
	}

	static async update({ id, list, workspaceId }) {
		const listData = await ListRepository.getOneList(id, workspaceId);
		if (!listData) {
			throw new Conflict("Нет листа с таким ID");
		}
		// получим все компании данного пользователя из листа который переименовываем
		const companies = await CompanyRepository.getAllCompaniesByUser(listData.userId, workspaceId)
		const filterCompanies = companies.filter(c => c.listName == listData.name)
		if (filterCompanies) {
			// изменим во всех компаниях лист на новый и сохраняем каждую в цикле
			for (let i = 0; i < filterCompanies.length; i++) {
				filterCompanies[i].listName = list.name
				filterCompanies[i].delListName = list.name
				CompanyRepository.updateCompany({ id: filterCompanies[i]._id, company: filterCompanies[i], workspaceId })
			}
		}
		// проверяем выбран ли лист checked
		if (list.checked === true) {
			// получаем лист, который выбран до этого и меняем у него checked на false
			const listData = await ListRepository.getAllListsByUser(list.userId, workspaceId)
			const listCheckedData = listData.filter(l => l.checked === true)
			if (listCheckedData.length > 0) {
				listCheckedData[0].checked = false
				await ListRepository.updateList({ id: listCheckedData[0]._id, list: listCheckedData[0] })
			}
		}
		const response = await ListRepository.updateList({ id, list })
		return response
	}
}

export default ListService