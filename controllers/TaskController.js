// controllers/TaskController.js

const TaskService = require("../services/TaskService");

class TaskController {
  static async updateTaskStatus(req, res) {
    const { taskId } = req.params;
    const { status } = req.body; // Ожидаем статус задачи

    if (!['not completed', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Неверный статус задачи' });
    }

    try {
      const task = await TaskService.updateTaskStatus(taskId, status);
      res.status(200).json({ message: 'Статус задачи обновлен', task });
    } catch (err) {
      res.status(500).json({ message: 'Ошибка при обновлении статуса задачи' });
    }
  }
}

module.exports = TaskController;
