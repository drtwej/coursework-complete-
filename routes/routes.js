const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project'); // Модель проекта

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Пользователь зарегистрирован' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка регистрации' });
    }
});

// Вход пользователя
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Неверный пароль' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка входа' });
    }
});

// routes.js

const express = require("express");
const ProjectController = require("../controllers/ProjectController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/projects", authMiddleware, ProjectController.createProject); // Добавили middleware для проверки авторизации

module.exports = router;

// Middleware для проверки токена
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Нет авторизации' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Неверный или истёкший токен' });
    }
}

// Получение всех проектов пользователя
router.get('/projects', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.user.id });
        res.json({ projects });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения проектов' });
    }
});

// Создание нового проекта
router.post('/projects', authenticateToken, async (req, res) => {
    const { title, description, dueDate } = req.body;

    try {
        const newProject = new Project({
            title,
            description,
            dueDate,
            createdBy: req.user.id,
        });

        await newProject.save();
        res.status(201).json({ message: 'Проект успешно добавлен' });
    } catch (error) {
        res.status(500).json({ message: 'Произошла ошибка при добавлении проекта' });
    }
});

// Редактирование проекта
router.put('/projects/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const project = await Project.findOne({ _id: id, createdBy: req.user.id });

        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }

        project.title = title || project.title;
        project.description = description || project.description;

        await project.save();
        res.json({ message: 'Проект успешно обновлен' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении проекта' });
    }
});

// Удаление проекта
router.delete('/projects/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findOneAndDelete({ _id: id, createdBy: req.user.id });

        if (!project) {
            return res.status(404).json({ message: 'Проект не найден' });
        }

        res.json({ message: 'Проект успешно удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении проекта' });
    }
});

module.exports = router;
