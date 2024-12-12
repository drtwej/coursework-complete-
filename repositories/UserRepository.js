const bcrypt = require("bcrypt");
const pool = require("../db");

class UserRepository {
  static async createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
      return { email, password: hashedPassword };
    } catch (error) {
      throw new Error("Error creating user");
    }
  }

  static async findUserByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  }
}

module.exports = UserRepository;
