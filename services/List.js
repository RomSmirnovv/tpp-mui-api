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
			listCheckedData[0].checked = false
			await ListRepository.updateList({ id: listCheckedData[0]._id, list: listCheckedData[0] })
		}
		// получаем все колонки в базе данных
		const allColumns = await ColumnRepository.getAll();
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

	static async getAllLists() {
		const response = await ListRepository.getAllLists()
		return response
	}

	static async getListsByUser(userId) {
		const response = await ListRepository.getAllListsByUser(userId)
		return response.sort((a, b) => a.order - b.order);
	}

	static async delete(id) {
		const listData = await ListRepository.getOneList(id);
		if (!listData) {
			throw new Conflict("Нет листа с таким ID");
		}

		// проверяем выбран ли лист checked
		if (listData.checked === true) {
			// получаем первый лист пользователя и делаем его выбраным checked
			const listAllDataUser = await ListRepository.getAllListsByUser(listData.userId)
			listAllDataUser[0].checked = true
			await ListRepository.updateList({ id: listAllDataUser[0]._id, list: listAllDataUser[0] })
		}
		await ListRepository.deleteList(id);
	}

	static async update({ id, list }) {
		const listData = await ListRepository.getOneList(id);
		if (!listData) {
			throw new Conflict("Нет листа с таким ID");
		}
		// получим все компании данного пользователя из листа который переименовываем
		const companies = await CompanyRepository.getAllCompaniesByUser(listData.userId)
		const filterCompanies = companies.filter(c => c.listName == listData.name)
		if (filterCompanies) {
			// изменим во всех компаниях лист на новый и сохраняем каждую в цикле
			for (let i = 0; i < filterCompanies.length; i++) {
				filterCompanies[i].listName = list.name
				filterCompanies[i].delListName = list.name
				CompanyRepository.updateCompany({ id: filterCompanies[i]._id, company: filterCompanies[i] })
			}
		}
		// проверяем выбран ли лист checked
		if (list.checked === true) {
			// получаем лист, который выбран до этого и меняем у него checked на false
			const listData = await ListRepository.getAllListsByUser(list.userId)
			const listCheckedData = listData.filter(l => l.checked === true)
			listCheckedData[0].checked = false
			await ListRepository.updateList({ id: listCheckedData[0]._id, list: listCheckedData[0] })
		}
		const response = await ListRepository.updateList({ id, list })
		return response
	}
}

export default ListService