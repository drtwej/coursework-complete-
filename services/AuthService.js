// В AuthService
const jwt = require('jsonwebtoken');
const UserRepository = require("../repositories/UserRepository");

class AuthService {
  static async login(email, password) {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) throw new Error('Пользователь не найден');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Неверный пароль');

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  }
}

module.exports = AuthService;
