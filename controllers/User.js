import UserService from '../services/User.js';
import UserRepository from '../repositories/User.js';
import ErrorsUtils, { NotFound } from '../utils/Errors.js';

const serializeUser = (user) => {
  if (!user) {
    return null;
  }

  const plain = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete plain.password;
  delete plain.pText;
  return plain;
};

class UserController {
  static async createUser(req, res) {
    const {
      name,
      surname,
      patronymic,
      phone,
      birthDate,
      login,
      password,
      role,
    } = req.body || {};

    try {
      const user = await UserService.createUser({
        name,
        surname,
        patronymic,
        phone,
        birthDate,
        login,
        password,
        role,
      });

      return res.status(201).json(serializeUser(user));
    } catch (error) {
      return ErrorsUtils.catchError(res, error);
    }
  }

  static async getUserByProfile(req, res) {
    try {
      const user = await UserService.getOneByProfile(req.params.id);
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      return res.status(200).json(serializeUser(user));
    } catch (error) {
      return ErrorsUtils.catchError(res, error);
    }
  }

  static async getAllUsers(_req, res) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json(users.map(serializeUser));
    } catch (error) {
      return ErrorsUtils.catchError(res, error);
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.delete(req.params.id);
      return res.status(200).json(`Пользователь с id = ${req.params.id} удалён`);
    } catch (error) {
      return ErrorsUtils.catchError(res, error);
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await UserService.update(req.body || {});
      return res.status(200).json(serializeUser(user));
    } catch (error) {
      return ErrorsUtils.catchError(res, error);
    }
  }

  static async getUser(req, res) {
    try {
      const user = await UserRepository.getUserById(req.auth.userId);
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }

      return res.status(200).json({
        status: 'success',
        data: {
          user: serializeUser(user),
        },
      });
    } catch (error) {
      return ErrorsUtils.catchError(res, error);
    }
  }
}

export default UserController;
