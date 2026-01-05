import CompanyService from '../services/Company.js'
import ErrorsUtils from "../utils/Errors.js";
import { getWorkspaceIdFromRequest } from '../utils/getWorkspaceId.js';

class CompanyController {

	static async createCompany(req, res) {
		const company = req.body
		try {
			// Получаем workspaceId из запроса
			const workspaceId = await getWorkspaceIdFromRequest(req);
			if (workspaceId) {
				company.workspaceId = workspaceId;
			}
			const newCompany = await CompanyService.createCompany(company)
			return res.status(200).json(newCompany);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async getOneCompany(req, res) {
		const { id } = req.params
		try {
			const company = await CompanyService.getOneCompany(id)
			return res.status(200).json(company);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}


	static async getAllCompanies(req, res) {
		try {
			// Получаем workspaceId из запроса для фильтрации
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const companies = await CompanyService.getAllCompanies(workspaceId)
			return res.status(200).json(companies)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}


	static async getAllCompaniesByUser(req, res) {
		const { userId } = req.params
		try {
			// Получаем workspaceId из запроса для фильтрации
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const companies = await CompanyService.getAllCompaniesByUser(userId, workspaceId)
			return res.status(200).json(companies)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	/**
	 * Получить все компании по workspaceId
	 */
	static async getAllCompaniesByWorkspace(req, res) {
		const { workspaceId } = req.params
		try {
			const companies = await CompanyService.getAllCompaniesByWorkspace(workspaceId)
			return res.status(200).json(companies)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async getAllCompaniesByUserAndList(req, res) {
		const { userId } = req.params
		const { listName } = req.params
		try {
			// Получаем workspaceId из запроса для фильтрации
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const companies = await CompanyService.getAllCompaniesByUserAndList(userId, listName, workspaceId)
			return res.status(200).json(companies)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async deleteCompany(req, res) {
		const { id } = req.params
		try {
			// Получаем workspaceId из запроса для проверки принадлежности
			const workspaceId = await getWorkspaceIdFromRequest(req);
			await CompanyService.delete(id, workspaceId)
			return res.status(200).json(`Компания с id = ${id} удален!`)
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async updateCompany(req, res) {
		const { id } = req.params
		const company = req.body
		try {
			// Получаем workspaceId из запроса для проверки принадлежности
			const workspaceId = await getWorkspaceIdFromRequest(req);
			const updateCompany = await CompanyService.update({ id, company, workspaceId })
			return res.status(200).json(updateCompany);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default CompanyController