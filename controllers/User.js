import UserService from '../services/User.js'
import ErrorsUtils from "../utils/Errors.js";
import AuthService from "../services/Auth.js";

class UserController {

	static async createUser(req, res) {
		const { name, surname, patronymic, phone, birthDate, login, password, role } = req.body

		try {
			const user = await UserService.createUser({ name, surname, patronymic, phone, birthDate, login, password, role })
			return res.status(200).json(user)
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async getUserByProfile(req, res) {
		const { id } = req.params
		try {
			const user = await UserService.getOneByProfile(id)
			return res.status(200).json(user);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}


	static async getAllUsers(req, res) {
		try {
			const users = await UserService.getAllUsers()
			return res.status(200).json(users)
		} catch (err) {
			return ErrorsUtils.catchError(res, err)
		}
	}

	static async deleteUser(req, res) {
		const { id } = req.params
		try {
			await UserService.delete(id)
			return res.status(200).json(`Пользователь с id = ${id} удален!`)
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async updateUser(req, res) {
		const user = req.body
		try {
			const updateUser = await UserService.update(user)
			return res.status(200).json(updateUser);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async getUser(req, res, next) {
		const currentRefreshToken = req.cookies.refreshToken;
		const { fingerprint } = req;

		try {
			const user = await AuthService.getUserByToken({ currentRefreshToken, fingerprint });
			const {
				_id,
				name,
				surname,
				patronymic,
				login,
				projects,
				role
			} = user
			return res.status(200).json({
				status: 'success',
				data: {
					user: {
						_id,
						name,
						surname,
						patronymic,
						login,
						projects,
						role
					},
				}
			});
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default UserController