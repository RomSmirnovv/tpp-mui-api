import AuthService from "../services/Auth.js";
import EmailVerificationService from "../services/EmailVerification.js";
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
			const { accessToken, refreshToken, accessTokenExpiration, user } =
				await AuthService.login({
					login,
					password,
					fingerprint,
				});

			// Проверка подтверждения email
			if (!user.isEmailVerified) {
				return res.status(403).json({
					message: 'Email не подтвержден',
					error: 'EMAIL_NOT_VERIFIED',
					isEmailVerified: false
				});
			}

			res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);
			res.cookie('logged_in', true, COOKIE_SETTINGS.REFRESH_TOKEN);

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

	/**
	 * Подтверждение email по токену
	 * GET /auth/verify-email/:token
	 */
	static async verifyEmail(req, res) {
		try {
			const { token } = req.params;
			console.log('🔍 Попытка подтверждения email с токеном:', token ? token.substring(0, 20) + '...' : 'отсутствует');
			
			const result = await EmailVerificationService.verifyEmail(token);

			console.log('✅ Email подтвержден успешно');
			return res.status(200).json({
				message: result.message,
				alreadyVerified: result.alreadyVerified || false
			});
		} catch (err) {
			console.error('❌ Ошибка при подтверждении email:', err.message);
			return ErrorsUtils.catchError(res, err);
		}
	}

	/**
	 * Повторная отправка токена подтверждения
	 * POST /auth/resend-verification
	 */
	static async resendVerification(req, res) {
		try {
			const { userId } = req.body;
			const result = await EmailVerificationService.resendToken(userId);

			return res.status(200).json({
				message: 'Ссылка для подтверждения email отправлена'
			});
		} catch (err) {
			return ErrorsUtils.catchError(res, err);
		}
	}
}

export default AuthController;
