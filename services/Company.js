import { Notification } from '../models/notification.js';
import CompanyRepository from '../repositories/Company.js';
import NotificationRepository from '../repositories/Notification.js';
import { Conflict } from '../utils/Errors.js'
import moment from 'moment'

class CompanyService {

	static async createCompany(company) {
		const response = await CompanyRepository.createCompany(company)
		return response
	}

	static async getOneCompany(id) {
		const response = await CompanyRepository.getOneCompany(id)
		return response
	}

	static async getAllCompaniesByUser(userId) {
		const response = await CompanyRepository.getAllCompaniesByUser(userId)
		return response
	}

	static async getAllCompaniesByUserAndList(userId, listName) {
		const response = await CompanyRepository.getAllCompaniesByUserAndList(userId, listName)
		return response
	}

	static async getAllCompanies() {
		const response = await CompanyRepository.getAllCompanies()
		return response
	}

	static async delete(id) {
		const companyData = await CompanyRepository.getOneCompany(id);
		if (!companyData) {
			throw new Conflict("Нет компании с таким ID");
		}
		await CompanyRepository.deleteCompany(id)

		// проверяем есть ли уведомления данной компании, если есть то удаляем их
		const notification = await Notification.findOne({ companyId: id })
		if (notification) {
			await Notification.deleteOne({ _id: notification._id })
		}
	}

	static async update({ id, company }) {
		let newCompany = company

		if (newCompany.listName == 'Корзина') {
			newCompany.notificationDateTime = ''
			const notification = await Notification.findOne({ companyId: newCompany._id })
			if (notification) {
				await Notification.deleteOne({ _id: notification._id })
			}
		}
		const companyData = await CompanyRepository.getOneCompany(id);
		if (!companyData) {
			throw new Conflict("Нет компании с таким ID");
		}

		const response = await CompanyRepository.updateCompany({ id, company: newCompany })
		return response
	}
}

export default CompanyService