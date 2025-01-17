import UserRepository from '../repositories/User.js';
import { Conflict } from '../utils/Errors.js'
import bcrypt from "bcryptjs";
import moment from 'moment/moment.js';
import ListService from './List.js';

class UserService {

	static async createUser({ name, surname, patronymic, phone, birthDate, login, password, role }) {
		const userData = await UserRepository.getUserData(login);
		if (userData) {
			throw new Conflict("Пользователь с таким логином уже существует");
		}
		let birthDateFormated = moment(birthDate).format('DD.MM.YYYY')

		const hashedPassword = bcrypt.hashSync(password, 8);

		const response = await UserRepository.createUser({ name, surname, patronymic, phone, birthDate: birthDateFormated, login, hashedPassword, role });

		if (response) {
			const add_lists = [
				{
					name: 'Основной',
					checked: true,
					userId: response._id,
					order: 0
				},
				{
					name: 'Корзина',
					checked: false,
					userId: response._id,
					order: 9999
				}
			]
			for (let n = 0; n < add_lists.length; n++) {
				await ListService.createList(add_lists[n])
			}
		}

		return response
	}

	static async getOneByProfile(id) {
		const response = await UserRepository.getOneByProfile(id)
		return response
	}

	static async getAllUsers() {
		const response = await UserRepository.getAllUsers()
		const newRes = []
		for (let i = 0; i < response.length; i++) {
			newRes[i] = response[i]
			newRes[i].password = ''
		}
		return newRes
	}

	static async delete(id) {
		const userData = await UserRepository.getOneByProfile(id);
		if (!userData) {
			throw new Conflict("Нет пользователя с таким ID");
		}
		await UserRepository.deleteUser(id);
	}

	static async update(user) {
		const userData = await UserRepository.getOneByProfile(user._id);
		if (!userData) {
			throw new Conflict("Нет пользователя с таким ID");
		}

		const response = await UserRepository.updateUser(user)
		return response
	}
}

export default UserService