import AuthService from "../services/Auth.js";
import ErrorsUtils from "../utils/Errors.js";
import { COOKIE_SETTINGS } from "../constants.js";
import moment from 'moment/moment.js';
import jwt from "jsonwebtoken";
import UserRepository from '../repositories/User.js';

class AuthController {
	static async signIn(req, res) {
		const { login, password } = req.body;
		const { fingerprint } = req;
		try {
			const { accessToken, refreshToken, accessTokenExpiration
			} =
				await AuthService.login({
					login,
					password,
					fingerprint,
				});


			res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);
			res.cookie('logged_in', true, { httpOnly: false });

			return res.status(200).json({
				accessToken, accessTokenExpiration
			});
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async signUp(req, res) {
		const { name, surname, patronymic, phone, birthDate, login, password, role } = req.body;
		let birthDateFormated = moment(birthDate).format('DD.MM.YYYY')
		const { fingerprint } = req;

		try {
			const user = await AuthService.register({ name, surname, patronymic, login, password, role });

			return res.status(200).json({
				message: `Пользователь ${surname} ${name} успешно создан`
			});
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async logOut(req, res) {
		const refreshToken = req.cookies.refreshToken;
		try {
			await AuthService.logOut(refreshToken);

			res.cookie('refreshToken', '', { maxAge: 1 });
			res.cookie('logged_in', false, { maxAge: 1 });

			return res.sendStatus(200);
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}

	static async refresh(req, res) {
		const currentRefreshToken = req.cookies.refreshToken;
		const { fingerprint } = req;

		try {
			const { accessToken, refreshToken, accessTokenExpiration } =
				await AuthService.refresh({
					currentRefreshToken,
					fingerprint,
				});

			res.cookie('refreshToken', refreshToken)

			return res.status(200).json({
				accessToken,
				accessTokenExpiration
			});
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default AuthController;
