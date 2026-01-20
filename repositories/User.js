import mongoose from 'mongoose';
import { User } from '../models/user.js'

class UserRepository {


	static async createUser({ name, surname, patronymic, phone, birthDate, login, hashedPassword, role, workspaceId, isEmailVerified }) {
		const userData = { name, surname, patronymic, phone, birthDate, login, password: hashedPassword, role };
		if (workspaceId) {
			userData.workspaceId = workspaceId;
		}
		// Если isEmailVerified передан, устанавливаем его (для админов)
		if (isEmailVerified !== undefined) {
			userData.isEmailVerified = isEmailVerified;
		}
		const user = await new User(userData);
		const response = user
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

	static async getUserData(login) {
		const response = await User
			.findOne({ login })
			.then((user) => {
				return user
			})
		if (!response) {
			return null;
		}
		return response
	}

	static async getUserById(_id) {
		const response = await User
			.findOne({ _id })
			.then((user) => {
				return user
			})

		if (!response) {
			return null;
		}
		return response
	}

	static async getOneByProfile(_id) {
		const response = await User
			.findOne({ _id })
			.then((user) => {
				return user
			})

		if (!response) {
			return null;
		}
		return response
	}

	static async getAllUsers() {
		const response = await User.find()
			.then((result) => {
				return result
			})
			.catch((e) => console.log(e))
		if (!response) {
			return null;
		}
		return response
	}

	static async deleteUser(id) {
		await User
			.deleteOne({ _id: id })
	}

	static async updateUser(user) {
		await User
			.updateOne({ _id: user._id }, { $set: user })
			.then((userRes) => {
				return userRes
			})
		const response = User
			.findOne({ _id: user._id })
			.then((userRes) => {
				return userRes
			})
		if (!response) {
			return null;
		}
		return response
	}
}

export default UserRepository;
