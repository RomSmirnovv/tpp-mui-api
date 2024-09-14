import CompanyService from '../services/Company.js'
import ErrorsUtils from "../utils/Errors.js";

class CompanyController {

	static async createCompany(req, res) {
		const company = req.body
		try {
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
			const companies = await CompanyService.getAllCompanies()
			return res.status(200).json(companies)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}


	static async getAllCompaniesByUser(req, res) {
		const { userId } = req.params
		try {
			const companies = await CompanyService.getAllCompaniesByUser(userId)
			return res.status(200).json(companies)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async getAllCompaniesByUserAndList(req, res) {
		const { userId } = req.params
		const { listName } = req.params
		try {
			const companies = await CompanyService.getAllCompaniesByUserAndList(userId, listName)
			return res.status(200).json(companies)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async deleteCompany(req, res) {
		const { id } = req.params
		try {
			await CompanyService.delete(id)
			return res.status(200).json(`Компания с id = ${id} удален!`)
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async updateCompany(req, res) {
		const { id } = req.params
		const company = req.body
		try {
			const updateCompany = await CompanyService.update({ id, company })
			return res.status(200).json(updateCompany);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default CompanyController