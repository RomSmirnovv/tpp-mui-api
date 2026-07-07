import AuthService from '../services/Auth.js';
import TokenService from '../services/Token.js';
import ErrorsUtils, { Forbidden } from '../utils/Errors.js';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  COOKIE_SETTINGS,
} from '../constants.js';

export const ADMIN_ROLE = 2;

export const isAdmin = (req) => Number(req.auth?.role) === ADMIN_ROLE;

export const requireAuth = async (req, res, next) => {
  try {
    const { auth, rotatedAccessToken, rotatedRefreshToken } = await AuthService.authenticateRequest({
      accessToken: TokenService.extractAccessToken(req),
      refreshToken: req.cookies?.[REFRESH_TOKEN_COOKIE],
      fingerprint: req.fingerprint,
    });

    if (rotatedAccessToken) {
      res.cookie(ACCESS_TOKEN_COOKIE, rotatedAccessToken, COOKIE_SETTINGS.ACCESS_TOKEN);
    }

    if (rotatedRefreshToken) {
      res.cookie(REFRESH_TOKEN_COOKIE, rotatedRefreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);
    }

    req.auth = {
      userId: String(auth._id),
      login: auth.login,
      role: Number(auth.role),
      fullName: auth.fullName || '',
    };

    return next();
  } catch (error) {
    return ErrorsUtils.catchError(res, error);
  }
};

export const requireAdmin = (req, res, next) => {
  if (!isAdmin(req)) {
    return ErrorsUtils.catchError(res, new Forbidden('Требуются права администратора'));
  }

  return next();
};

export const requireSelfOrAdmin = (paramName = 'userId') => (req, res, next) => {
  const targetUserId = String(req.params?.[paramName] || '');

  if (isAdmin(req) || targetUserId === req.auth.userId) {
    return next();
  }

  return ErrorsUtils.catchError(res, new Forbidden('Нет доступа к данным другого пользователя'));
};

export const forceOwnBody = (options = {}) => (req, _res, next) => {
  if (isAdmin(req)) {
    return next();
  }

  req.body ||= {};
  req.body[options.userIdField || 'userId'] = req.auth.userId;

  const fullNameField = options.fullNameField;
  if (fullNameField) {
    req.body[fullNameField] = req.auth.fullName;
  }

  return next();
};
