import jwt from "jsonwebtoken";
import { Forbidden, Unauthorized } from "../utils/Errors.js";
import config from "../config/env.js";

class TokenService {
	static async generateAccessToken(payload) {
		return await jwt.sign(payload, config.jwt.accessTokenSecret, {
			expiresIn: config.jwt.accessTokenExpiration,
		});
	}

	static async generateRefreshToken(payload) {
		return await jwt.sign(payload, config.jwt.refreshTokenSecret, {
			expiresIn: config.jwt.refreshTokenExpiration,
		});
	}

	static async verifyAccessToken(accessToken) {
		return await jwt.verify(accessToken, config.jwt.accessTokenSecret);
	}

	static async verifyRefreshToken(refreshToken) {
		return await jwt.verify(refreshToken, config.jwt.refreshTokenSecret);
	}

	static async checkAccess(req, _, next) {
		const authHeader = req.headers.authorization;
		const token = authHeader?.split(" ")?.[1];

		if (!token) {
			return next(new Unauthorized());
		}

		try {
			req.user = await TokenService.verifyAccessToken(token);
			console.log(req.user);
		} catch (error) {
			console.log(error);
			return next(new Forbidden(error));
		}

		next();
	}
}

export default TokenService;
