import mongoose from 'mongoose';
import { Company } from '../models/company.js'

class CompanyRepository {


	static async createCompany(company) {
		const newCompany = await new Company(company)
		const response = newCompany
			.save()
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
		if (!response) {
			return null;
		}
		return response

	}

	static async getOneCompany(id, workspaceId) {
		const query = { _id: id };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Company
			.findOne(query)
			.then((company) => {
				return company
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllCompaniesByUser(id, workspaceId) {
		const query = { userId: id };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Company
			.find(query)
			.then((company) => {
				return company
			})
		if (!response) {
			return null;
		}
		return response
	}

	/**
	 * Получить все компании по workspaceId
	 */
	static async getAllCompaniesByWorkspace(workspaceId) {
		const response = await Company
			.find({ workspaceId })
			.then((companies) => {
				return companies
			})
			.catch((e) => {
				console.log('Error getting companies by workspace:', e);
				return null;
			})
		return response
	}

	static async getAllCompaniesByUserAndList(userId, listName, workspaceId) {
		const query = { userId, listName };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Company
			.find(query)
			.then((company) => {
				return company
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllCompanies(workspaceId) {
		const query = {};
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		const response = await Company.find(query)
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
		if (!response) {
			return null;
		}
		return response
	}

	static async deleteCompany(id, workspaceId) {
		const query = { _id: id };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		await Company
			.deleteOne(query)
	}

	static async updateCompany({ id, company, workspaceId }) {
		const query = { _id: id };
		if (workspaceId) {
			query.workspaceId = workspaceId;
		}
		await Company
			.updateOne(query, { $set: company })
			.then((companyRes) => {
				return companyRes
			})
		const response = Company
			.findOne(query)
			.then((companyRes) => {
				return companyRes
			})
		if (!response) {
			return null;
		}
		return response
	}
}

export default CompanyRepository;
