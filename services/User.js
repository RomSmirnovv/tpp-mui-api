import bcrypt from 'bcryptjs';
import UserRepository from '../repositories/User.js';
import { Conflict, NotFound, Unprocessable } from '../utils/Errors.js';
import ListService from './List.js';
import RefreshSessionRepository from '../repositories/RefreshSession.js';

const ALLOWED_ROLES = new Set([2, 3]);

class UserService {
  static async createUser({ name, surname, patronymic = '', phone = '', birthDate = '', login, password, role = 3 }) {
    if (!name || !surname || !login || !password) {
      throw new Unprocessable('Заполните имя, фамилию, логин и пароль');
    }

    if (String(password).length < 12) {
      throw new Unprocessable('Пароль должен содержать минимум 12 символов');
    }

    const normalizedRole = Number(role);
    if (!ALLOWED_ROLES.has(normalizedRole)) {
      throw new Unprocessable('Недопустимая роль пользователя');
    }

    const existingUser = await UserRepository.getUserData(login);
    if (existingUser) {
      throw new Conflict('Пользователь с таким логином уже существует');
    }

    const hashedPassword = await bcrypt.hash(String(password), 12);

    const response = await UserRepository.createUser({
      name: String(name).trim(),
      surname: String(surname).trim(),
      patronymic: String(patronymic || '').trim(),
      phone: String(phone || '').trim(),
      birthDate: String(birthDate || '').trim(),
      login: String(login).trim(),
      hashedPassword,
      role: normalizedRole,
    });

    const defaultLists = [
      { name: 'Основной', checked: true, userId: response._id, order: 0 },
      { name: 'Корзина', checked: false, userId: response._id, order: 9999 },
    ];

    for (const list of defaultLists) {
      await ListService.createList(list);
    }

    return response;
  }

  static async getOneByProfile(id) {
    return UserRepository.getOneByProfile(id);
  }

  static async getAllUsers() {
    return UserRepository.getAllUsers();
  }

  static async delete(id) {
    const user = await UserRepository.getOneByProfile(id);

    if (!user) {
      throw new NotFound('Пользователь не найден');
    }

    if (user.role === 2 && !user.blocked) {
      const activeAdmins = await UserRepository.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw new Conflict('Нельзя удалить последнего активного администратора');
      }
    }

    await UserRepository.deleteUser(id);
  }

  static async update(user) {
    const existingUser = await UserRepository.getOneByProfile(user?._id);

    if (!existingUser) {
      throw new NotFound('Пользователь не найден');
    }

    const nextRole = user.role === undefined ? existingUser.role : Number(user.role);
    if (!ALLOWED_ROLES.has(nextRole)) {
      throw new Unprocessable('Недопустимая роль пользователя');
    }

    const willBeBlocked = user.blocked === undefined ? existingUser.blocked : Boolean(user.blocked);
    if (existingUser.role === 2 && !existingUser.blocked && (nextRole !== 2 || willBeBlocked)) {
      const activeAdmins = await UserRepository.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw new Conflict('Нельзя отключить или понизить последнего активного администратора');
      }
    }

    const allowedFields = [
      'name',
      'surname',
      'patronymic',
      'phone',
      'birthDate',
      'login',
      'role',
      'blocked',
    ];

    const update = { _id: existingUser._id };

    for (const field of allowedFields) {
      if (user[field] !== undefined) {
        update[field] = field === 'role' ? nextRole : user[field];
      }
    }

    if (user.password) {
      if (String(user.password).length < 12) {
        throw new Unprocessable('Новый пароль должен содержать минимум 12 символов');
      }
      update.password = await bcrypt.hash(String(user.password), 12);
      await RefreshSessionRepository.deleteRefreshSessionsByUser(existingUser._id);
    }

    return UserRepository.updateUser(update);
  }
}

export default UserService;
