import config from './config/env.js';

export const COOKIE_SETTINGS = {
	REFRESH_TOKEN: config.cookie.refreshToken,
};

export const ACCESS_TOKEN_EXPIRATION = 18e5; // 1800 * 1000 (30 минут)
