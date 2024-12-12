// controllers/ProjectController.js

const ProjectService = require("../services/ProjectService");
const TaskService = require("../services/TaskService");

class ProjectController {
  static async createProject(req, res) {
    const { title, description, tasks } = req.body; // Добавим поле tasks для списка задач
    const { userId, role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Только администратор может создавать проекты' });
    }

    try {
      const project = await ProjectService.createProject(userId, title, description);
      if (tasks && tasks.length > 0) {
        tasks.forEach(task => {
          TaskService.createTask(project._id, task.title, task.description);
        });
      }
      res.status(201).json({ message: 'Проект и задачи успешно созданы', project });
    } catch (err) {
      res.status(500).json({ message: 'Ошибка при создании проекта' });
    }
  }
}

module.exports = ProjectController;
