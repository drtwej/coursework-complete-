// services/ProjectService.js

const Project = require("../models/Project");
const Task = require("../models/Task");

class ProjectService {
  static async getProjects(userId) {
    const projects = await Project.find({ assignedTo: userId }).populate('tasks'); // Загрузка задач в проект

    return projects.map(project => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
      const completionPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
      return { ...project.toObject(), completionPercentage };
    });
  }

  static async createProject(userId, title, description) {
    const project = new Project({
      title,
      description,
      assignedTo: userId,
      tasks: [] // Задачи будут добавляться отдельно
    });
    return await project.save();
  }
}

module.exports = ProjectService;
