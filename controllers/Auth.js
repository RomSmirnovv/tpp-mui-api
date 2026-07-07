import AuthService from '../services/Auth.js';
import ErrorsUtils, { BadRequest } from '../utils/Errors.js';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  LOGGED_IN_COOKIE,
  COOKIE_SETTINGS,
  CLEAR_ACCESS_COOKIE,
  CLEAR_REFRESH_COOKIE,
  CLEAR_LOGGED_IN_COOKIE,
} from '../constants.js';

class AuthController {
  static async signIn(req, res) {
    const { login, password } = req.body || {};

    try {
      if (!login || !password) {
        throw new BadRequest('Укажите логин и пароль');
      }

      const { accessToken, refreshToken, accessTokenExpiration } = await AuthService.login({
        login,
        password,
        fingerprint: req.fingerprint,
      });

      res.cookie(ACCESS_TOKEN_COOKIE, accessToken, COOKIE_SETTINGS.ACCESS_TOKEN);
      res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);
      // Этот cookie — только UI-маркер. Сервер никогда не использует его для авторизации.
      res.cookie(LOGGED_IN_COOKIE, 'true', COOKIE_SETTINGS.LOGGED_IN);

      return res.status(200).json({
        status: 'success',
        accessTokenExpiration,
      });
    } catch (error) {
      return ErrorsUtils.catchError(res, error);
    }
  }

  static async logOut(req, res) {
    try {
      await AuthService.logOut(req.cookies?.[REFRESH_TOKEN_COOKIE]);

      res.clearCookie(ACCESS_TOKEN_COOKIE, CLEAR_ACCESS_COOKIE);
      res.clearCookie(REFRESH_TOKEN_COOKIE, CLEAR_REFRESH_COOKIE);
      res.clearCookie(LOGGED_IN_COOKIE, CLEAR_LOGGED_IN_COOKIE);

      return res.sendStatus(200);
    } catch (error) {
      return ErrorsUtils.catchError(res, error);
    }
  }

  static async refresh(req, res) {
    try {
      const { accessToken, refreshToken, accessTokenExpiration } = await AuthService.refresh({
        currentRefreshToken: req.cookies?.[REFRESH_TOKEN_COOKIE],
        fingerprint: req.fingerprint,
      });

      res.cookie(ACCESS_TOKEN_COOKIE, accessToken, COOKIE_SETTINGS.ACCESS_TOKEN);
      res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);
      res.cookie(LOGGED_IN_COOKIE, 'true', COOKIE_SETTINGS.LOGGED_IN);

      return res.status(200).json({
        status: 'success',
        accessTokenExpiration,
      });
    } catch (error) {
      res.clearCookie(ACCESS_TOKEN_COOKIE, CLEAR_ACCESS_COOKIE);
      res.clearCookie(REFRESH_TOKEN_COOKIE, CLEAR_REFRESH_COOKIE);
      res.clearCookie(LOGGED_IN_COOKIE, CLEAR_LOGGED_IN_COOKIE);
      return ErrorsUtils.catchError(res, error);
    }
  }
}

export default AuthController;
