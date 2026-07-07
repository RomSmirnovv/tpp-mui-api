const cookieSecure = process.env.COOKIE_SECURE === 'true';

export const ACCESS_TOKEN_COOKIE = 'accessToken';
export const REFRESH_TOKEN_COOKIE = 'refreshToken';
export const LOGGED_IN_COOKIE = 'logged_in';

export const ACCESS_TOKEN_EXPIRATION = 30 * 60 * 1000;
export const REFRESH_TOKEN_EXPIRATION = 15 * 24 * 60 * 60 * 1000;

export const COOKIE_SETTINGS = {
  ACCESS_TOKEN: {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_EXPIRATION,
  },
  REFRESH_TOKEN: {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_EXPIRATION,
  },
  LOGGED_IN: {
    httpOnly: false,
    secure: cookieSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_EXPIRATION,
  },
};

export const CLEAR_ACCESS_COOKIE = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: 'lax',
  path: '/',
};

export const CLEAR_REFRESH_COOKIE = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: 'lax',
  path: '/',
};

export const CLEAR_LOGGED_IN_COOKIE = {
  httpOnly: false,
  secure: cookieSecure,
  sameSite: 'lax',
  path: '/',
};
