import ListRepository from '../repositories/List.js';
import CompanyRepository from '../repositories/Company.js';
import { Conflict } from '../utils/Errors.js';
import ColumnRepository from '../repositories/Column.js';
import { List } from '../models/list.js';

const TRASH_LIST_NAME = 'Корзина';

const isTrashList = (list) =>
	String(list?.name || '').trim().toLocaleLowerCase('ru-RU') === TRASH_LIST_NAME.toLocaleLowerCase('ru-RU');

const sortListsTrashLast = (lists = []) =>
	[...lists].sort((a, b) => {
		const trashOrder = Number(isTrashList(a)) - Number(isTrashList(b));
		if (trashOrder !== 0) return trashOrder;

		const aOrder = Number.isFinite(Number(a.order)) ? Number(a.order) : Number.MAX_SAFE_INTEGER;
		const bOrder = Number.isFinite(Number(b.order)) ? Number(b.order) : Number.MAX_SAFE_INTEGER;
		if (aOrder !== bOrder) return aOrder - bOrder;

		return String(a._id).localeCompare(String(b._id));
	});

const normalizeListOrders = async (userId) => {
	const lists = await ListRepository.getAllListsByUser(userId);
	const ordered = sortListsTrashLast(lists || []);

	await Promise.all(
		ordered.map((list, index) => {
			if (Number(list.order) === index) return null;
			return List.updateOne({ _id: list._id }, { $set: { order: index } });
		}),
	);

	return ordered;
};

class ListService {

	static async createList(list) {
		const allListsByUser = await ListRepository.getAllListsByUser(list.userId);
		const normalLists = (allListsByUser || []).filter((item) => !isTrashList(item));

		// Every new work list is placed directly before the system Trash list.
		list.order = normalLists.length;

		// проверяем выбран ли лист checked
		if (list.checked === true) {
			// получаем лист, который выбран до этого и меняем у него checked на false
			const listData = await ListRepository.getAllListsByUser(list.userId);
			const listCheckedData = listData.filter(l => l.checked === true);
			if (listCheckedData && listCheckedData.length > 0) {
				listCheckedData[0].checked = false;
				await ListRepository.updateList({ id: listCheckedData[0]._id, list: listCheckedData[0] });
			}
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
				checked: column.slug === 'name' ? true : false,
			};
		});
		// добавляем колонки в лист
		list.columns = columns;
		// создаем лист в базе данных
		const response = await ListRepository.createList(list);
		await normalizeListOrders(list.userId);
		return response;
	}

	static async getOneList(id) {
		const response = await ListRepository.getOneList(id);
		return response;
	}

	static async getAllLists() {
		const response = await ListRepository.getAllLists();
		return response;
	}

	static async getListsByUser(userId) {
		const response = await ListRepository.getAllListsByUser(userId);
		return sortListsTrashLast(response || []);
	}

	static async delete(id) {
		const listData = await ListRepository.getOneList(id);
		if (!listData) {
			throw new Conflict("Нет листа с таким ID");
		}

		// проверяем выбран ли лист checked
		if (listData.checked === true) {
			// выбираем первый рабочий лист; Корзина остаётся последней и резервной
			const listAllDataUser = sortListsTrashLast(await ListRepository.getAllListsByUser(listData.userId));
			const nextList = listAllDataUser.find((item) => String(item._id) !== String(listData._id));
			if (nextList) {
				nextList.checked = true;
				await ListRepository.updateList({ id: nextList._id, list: nextList });
			}
		}

		await ListRepository.deleteList(id);
		await normalizeListOrders(listData.userId);
	}

	static async update({ id, list }) {
		const listData = await ListRepository.getOneList(id);
		if (!listData) {
			throw new Conflict("Нет листа с таким ID");
		}
		// получим все компании данного пользователя из листа который переименовываем
		const companies = await CompanyRepository.getAllCompaniesByUser(listData.userId);
		const filterCompanies = companies.filter(c => c.listName == listData.name);
		if (filterCompanies) {
			// изменим во всех компаниях лист на новый и сохраняем каждую в цикле
			for (let i = 0; i < filterCompanies.length; i++) {
				filterCompanies[i].listName = list.name;
				filterCompanies[i].delListName = list.name;
				CompanyRepository.updateCompany({ id: filterCompanies[i]._id, company: filterCompanies[i] });
			}
		}
		// проверяем выбран ли лист checked
		if (list.checked === true) {
			// получаем лист, который выбран до этого и меняем у него checked на false
			const listData = await ListRepository.getAllListsByUser(list.userId);
			const listCheckedData = listData.filter(l => l.checked === true);
			if (listCheckedData.length > 0) {
				listCheckedData[0].checked = false;
				await ListRepository.updateList({ id: listCheckedData[0]._id, list: listCheckedData[0] });
			}
		}
		const response = await ListRepository.updateList({ id, list });
		await normalizeListOrders(listData.userId);
		return response;
	}
}

export default ListService;
