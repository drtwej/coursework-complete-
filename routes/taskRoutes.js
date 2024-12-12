const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");

router.post("/create", TaskController.createTask);
router.post("/delete/:id", TaskController.deleteTask);
// taskroutes.js

router.put("/tasks/:taskId", TaskController.updateTaskStatus); // Добавлен маршрут для обновления статуса задачи

module.exports = router;

