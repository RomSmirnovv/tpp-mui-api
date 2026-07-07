import { User } from '../models/user.js';

class UserRepository {
  static async createUser({ name, surname, patronymic, phone, birthDate, login, hashedPassword, role }) {
    return User.create({
      name,
      surname,
      patronymic,
      phone,
      birthDate,
      login,
      password: hashedPassword,
      role,
    });
  }

  static async getUserData(login) {
    return User.findOne({ login }).select('+password');
  }

  static async getUserById(_id) {
    return User.findById(_id).select('+password');
  }

  static async getOneByProfile(_id) {
    return User.findById(_id).select('+password');
  }

  static async getAllUsers() {
    return User.find().select('+password');
  }

  static async countActiveAdmins() {
    return User.countDocuments({ role: 2, blocked: false });
  }

  static async deleteUser(id) {
    await User.deleteOne({ _id: id });
  }

  static async updateUser(user) {
    const { _id, ...update } = user;
    return User.findByIdAndUpdate(
      _id,
      { $set: update },
      { new: true, runValidators: true },
    ).select('+password');
  }
}

export default UserRepository;
