import jwt from 'jsonwebtoken';
import { Unauthorized } from '../utils/Errors.js';

class TokenService {
  static generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15d' });
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  }

  static verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  }

  static extractAccessToken(request) {
    const cookieToken = request?.cookies?.accessToken;
    if (cookieToken) {
      return cookieToken;
    }

    const authHeader = request?.headers?.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : '';

    return bearerToken || null;
  }

  // Совместимость с прежними импортами. В новых маршрутах используется requireAuth.
  static checkAccess(req, _res, next) {
    const token = TokenService.extractAccessToken(req);

    if (!token) {
      return next(new Unauthorized('Требуется авторизация'));
    }

    try {
      req.user = TokenService.verifyAccessToken(token);
      return next();
    } catch (error) {
      return next(new Unauthorized('Сессия истекла'));
    }
  }
}

export default TokenService;
