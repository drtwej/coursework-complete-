const TaskRepository = require("../repositories/TaskRepository");

class TaskService {
  static async createTask(projectId, title, description) {
    return await TaskRepository.createTask(projectId, title, description);
  }

  static async deleteTask(id) {
    return await TaskRepository.deleteTask(id);
  }
}

module.exports = TaskService;
