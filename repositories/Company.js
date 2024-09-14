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

	static async getOneCompany(id) {
		const response = await Company
			.findOne({ _id: id })
			.then((company) => {
				return company
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllCompaniesByUser(id) {
		const response = await Company
			.find({ userId: id })
			.then((company) => {
				return company
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllCompaniesByUserAndList(userId, listName) {
		const response = await Company
			.find({ userId }, { listName })
			.then((company) => {
				return company
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getAllCompanies() {
		const response = await Company.find()
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
		if (!response) {
			return null;
		}
		return response
	}

	static async deleteCompany(id) {
		await Company
			.deleteOne({ _id: id })
	}

	static async updateCompany({ id, company }) {
		await Company
			.updateOne({ _id: id }, { $set: company })
			.then((companyRes) => {
				return companyRes
			})
		const response = Company
			.findOne({ _id: id })
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
