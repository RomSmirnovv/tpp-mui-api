import bcrypt from 'bcryptjs';
import TokenService from './Token.js';
import {
  Forbidden,
  NotFound,
  Unauthorized,
} from '../utils/Errors.js';
import RefreshSessionRepository from '../repositories/RefreshSession.js';
import UserRepository from '../repositories/User.js';
import { ACCESS_TOKEN_EXPIRATION } from '../constants.js';

class AuthService {
  static buildPayload(user) {
    return {
      _id: String(user._id),
      login: user.login,
      role: Number(user.role),
      fullName: `${user.surname || ''} ${user.name || ''}`.trim(),
    };
  }

  static async getActiveUserById(userId) {
    const user = await UserRepository.getUserById(userId);

    if (!user) {
      throw new Unauthorized('Пользователь не найден');
    }

    if (user.blocked) {
      throw new Forbidden('Доступ к аккаунту ограничен');
    }

    return user;
  }

  static async login({ login, password, fingerprint }) {
    const user = await UserRepository.getUserData(login);

    if (!user) {
      throw new Unauthorized('Неверный логин или пароль');
    }

    if (user.blocked) {
      throw new Forbidden('Доступ к аккаунту ограничен');
    }

    const validPassword = await bcrypt.compare(String(password || ''), user.password);

    if (!validPassword) {
      throw new Unauthorized('Неверный логин или пароль');
    }

    const payload = AuthService.buildPayload(user);
    const accessToken = TokenService.generateAccessToken(payload);
    const refreshToken = TokenService.generateRefreshToken(payload);

    await RefreshSessionRepository.createRefreshSession({
      _id: user._id,
      refreshToken,
      fingerprint,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async refresh({ fingerprint, currentRefreshToken }) {
    if (!currentRefreshToken) {
      throw new Unauthorized('Сессия не найдена');
    }

    const session = await RefreshSessionRepository.getRefreshSession(currentRefreshToken);

    if (!session) {
      throw new Unauthorized('Сессия истекла');
    }

    if (session.finger_print !== String(fingerprint?.hash || '')) {
      throw new Forbidden('Сессия открыта в другом браузере');
    }

    let payload;
    try {
      payload = TokenService.verifyRefreshToken(currentRefreshToken);
    } catch {
      await RefreshSessionRepository.deleteRefreshSession(currentRefreshToken);
      throw new Unauthorized('Сессия истекла');
    }

    if (String(payload._id) !== String(session.user_id)) {
      await RefreshSessionRepository.deleteRefreshSession(currentRefreshToken);
      throw new Unauthorized('Некорректная сессия');
    }

    const user = await AuthService.getActiveUserById(payload._id);

    await RefreshSessionRepository.deleteRefreshSession(currentRefreshToken);

    const actualPayload = AuthService.buildPayload(user);
    const accessToken = TokenService.generateAccessToken(actualPayload);
    const refreshToken = TokenService.generateRefreshToken(actualPayload);

    await RefreshSessionRepository.createRefreshSession({
      _id: user._id,
      refreshToken,
      fingerprint,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async authenticateRequest({ accessToken, refreshToken, fingerprint }) {
    if (accessToken) {
      try {
        const tokenPayload = TokenService.verifyAccessToken(accessToken);
        const user = await AuthService.getActiveUserById(tokenPayload._id);

        return {
          auth: AuthService.buildPayload(user),
          rotatedAccessToken: null,
        };
      } catch {
        // Истёкший access-token восстанавливаем только через зарегистрированную refresh-сессию.
      }
    }

    const refreshed = await AuthService.refresh({
      fingerprint,
      currentRefreshToken: refreshToken,
    });

    const refreshedPayload = TokenService.verifyAccessToken(refreshed.accessToken);

    return {
      auth: refreshedPayload,
      rotatedAccessToken: refreshed.accessToken,
      rotatedRefreshToken: refreshed.refreshToken,
    };
  }

  static async authenticateSocket(accessToken) {
    if (!accessToken) {
      throw new Unauthorized('Требуется авторизация');
    }

    let tokenPayload;
    try {
      tokenPayload = TokenService.verifyAccessToken(accessToken);
    } catch {
      throw new Unauthorized('Обновите страницу и войдите повторно');
    }

    const user = await AuthService.getActiveUserById(tokenPayload._id);
    return AuthService.buildPayload(user);
  }

  static async logOut(refreshToken) {
    await RefreshSessionRepository.deleteRefreshSession(refreshToken);
  }
}

export default AuthService;
