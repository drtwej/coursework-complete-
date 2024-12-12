const pool = require("../db");

class TaskRepository {
  static async createTask(projectId, title, description) {
    const result = await pool.query("INSERT INTO tasks (project_id, title, description) VALUES ($1, $2, $3)", [projectId, title, description]);
    return result.rows[0];
  }

  static async deleteTask(id) {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
  }
}

module.exports = TaskRepository;
