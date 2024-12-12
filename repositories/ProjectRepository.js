const pool = require("../db");

class ProjectRepository {
  static async findProjectsByUser(userId) {
    const result = await pool.query("SELECT * FROM projects WHERE user_id = $1", [userId]);
    return result.rows;
  }

  static async createProject(userId, title, description) {
    const result = await pool.query("INSERT INTO projects (user_id, title, description) VALUES ($1, $2, $3)", [userId, title, description]);
    return result.rows[0];
  }
}

module.exports = ProjectRepository;
