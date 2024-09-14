import bcrypt from "bcryptjs";
import TokenService from "./Token.js";
import {
	NotFound,
	Forbidden,
	Conflict,
	Unauthorized,
} from "../utils/Errors.js";
import RefreshSessionRepository from "../repositories/RefreshSession.js";
import UserRepository from "../repositories/User.js";
import { ACCESS_TOKEN_EXPIRATION } from "../constants.js";
import ListService from './List.js';

class AuthService {
	static async login({ login, password, fingerprint }) {
		const userData = await UserRepository.getUserData(login);
		if (!userData) {
			throw new NotFound("Пользователь с таким логином не найден");
		}
		const blocked = userData.blocked
		const role = userData.role

		if (blocked && userData.role == 3) {
			throw new Forbidden("Доступ к аккаунту ограничен");
		}

		const isPasswordValid = bcrypt.compareSync(password, userData.password);

		if (!isPasswordValid) {
			throw new Forbidden("Неверный логин или пароль");
		}

		const payload = { role: userData.role, _id: userData._id, login };

		const accessToken = await TokenService.generateAccessToken(payload);
		const refreshToken = await TokenService.generateRefreshToken(payload);

		await RefreshSessionRepository.createRefreshSession({
			_id: userData._id,
			refreshToken,
			fingerprint,
		});

		return {
			accessToken,
			refreshToken,
			accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
		};
	}

	static async register({ name, surname, patronymic, phone, birthDate, login, password, role, fingerprint }) {
		const userData = await UserRepository.getUserData(login);
		if (userData) {
			throw new Conflict("Пользователь с таким логином уже существует");
		}

		const hashedPassword = bcrypt.hashSync(password, 8);
		const pText = password
		const user = await UserRepository.createUser({ name, surname, patronymic, phone, birthDate, login, hashedPassword, role, pText });

		return {
			user
		};
	}

	static async logOut(refreshToken) {
		await RefreshSessionRepository.deleteRefreshSession(refreshToken);
	}

	static async refresh({ fingerprint, currentRefreshToken }) {
		if (!currentRefreshToken) {
			throw new Unauthorized();
		}

		const refreshSession = await RefreshSessionRepository.getRefreshSession(
			currentRefreshToken
		);

		if (!refreshSession) {
			throw new Unauthorized();
		}

		if (refreshSession.finger_print !== fingerprint.hash) {
			throw new Forbidden();
		}

		await RefreshSessionRepository.deleteRefreshSession(currentRefreshToken);

		let payload;
		try {
			payload = await TokenService.verifyRefreshToken(currentRefreshToken);
		} catch (error) {
			throw new Forbidden(error);
		}

		const {
			_id,
			role,
			login
		} = await UserRepository.getUserData(payload.login);

		const actualPayload = { _id, login, role };

		const accessToken = await TokenService.generateAccessToken(actualPayload);
		const refreshToken = await TokenService.generateRefreshToken(actualPayload);

		await RefreshSessionRepository.createRefreshSession({
			_id,
			refreshToken,
			fingerprint,
		});

		return {
			accessToken,
			refreshToken,
			accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
		};
	}

	static async getUserByToken({ currentRefreshToken, fingerprint }) {
		if (!currentRefreshToken) {
			throw new Unauthorized();
		}
		const refreshSession = await RefreshSessionRepository.getRefreshSession(
			currentRefreshToken
		);

		if (!refreshSession) {
			throw new Unauthorized();
		}
		if (refreshSession.finger_print !== fingerprint.hash) {
			throw new Forbidden();
		}

		const user = await UserRepository.getUserById(refreshSession.user_id);
		if (!user) {
			throw new Unauthorized();
		}
		return user;
	}
}

export default AuthService;
