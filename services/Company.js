import { Notification } from '../models/notification.js';
import CompanyRepository from '../repositories/Company.js';
import NotificationRepository from '../repositories/Notification.js';
import UserRepository from '../repositories/User.js';
import { Conflict } from '../utils/Errors.js'
import moment from 'moment'

class CompanyService {

	static async createCompany(company) {
		// ВАЖНО: При создании компании должен быть указан workspaceId
		// Если workspaceId не указан, используем workspaceId из userId (если пользователь существует)
		if (!company.workspaceId && company.userId) {
			const user = await UserRepository.getUserById(company.userId);
			if (user && user.workspaceId) {
				company.workspaceId = user.workspaceId;
			}
		}
		
		const response = await CompanyRepository.createCompany(company)
		return response
	}

	static async getOneCompany(id, workspaceId) {
		const response = await CompanyRepository.getOneCompany(id, workspaceId)
		return response
	}

	static async getAllCompaniesByUser(userId, workspaceId) {
		const response = await CompanyRepository.getAllCompaniesByUser(userId, workspaceId)
		return response
	}

	static async getAllCompaniesByUserAndList(userId, listName, workspaceId) {
		const response = await CompanyRepository.getAllCompaniesByUserAndList(userId, listName, workspaceId)
		return response
	}

	static async getAllCompanies(workspaceId) {
		const response = await CompanyRepository.getAllCompanies(workspaceId)
		return response
	}

	/**
	 * Получить все компании по workspaceId
	 */
	static async getAllCompaniesByWorkspace(workspaceId) {
		const response = await CompanyRepository.getAllCompaniesByWorkspace(workspaceId)
		return response
	}

	static async delete(id, workspaceId) {
		const companyData = await CompanyRepository.getOneCompany(id, workspaceId);
		if (!companyData) {
			throw new Conflict("Нет компании с таким ID");
		}
		await CompanyRepository.deleteCompany(id, workspaceId)

		// проверяем есть ли уведомления данной компании, если есть то удаляем их
		const notification = await Notification.findOne({ companyId: id })
		if (notification) {
			await Notification.deleteOne({ _id: notification._id })
		}
	}

	static async update({ id, company, workspaceId }) {
		let newCompany = company

		if (newCompany.listName == 'Корзина') {
			newCompany.notificationDateTime = ''
			const notification = await Notification.findOne({ companyId: newCompany._id })
			if (notification) {
				await Notification.deleteOne({ _id: notification._id })
			}
		}
		const companyData = await CompanyRepository.getOneCompany(id, workspaceId);
		if (!companyData) {
			throw new Conflict("Нет компании с таким ID");
		}

		const response = await CompanyRepository.updateCompany({ id, company: newCompany, workspaceId })
		return response
	}
}

export default CompanyService