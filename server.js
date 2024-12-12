const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const winston = require('winston');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Подключение переменных окружения

// Создаем приложение
const app = express();

// Настройка логирования с использованием winston
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'server.log', level: 'error' }),
  ],
});

// Настроим CORS и обработку JSON
app.use(cors());
app.use(express.json());

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost/project_management', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Обработка статичных файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Логирование всех входящих запросов
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Маршрут для логина (POST)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn('Попытка логина с отсутствующим email или паролем');
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('Неверный email или пароль', { email });
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Сравниваем хешированный пароль с введенным
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Создаем JWT токен
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info('Пользователь авторизован', { userId: user._id });
    return res.status(200).json({ token });
  } catch (err) {
    logger.error('Ошибка при логине', { error: err });
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Модели проекта
const Project = require('./models/Project');

// Маршрут для создания проектов (POST)
app.post('/api/projects', async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Нет авторизации' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newProject = new Project({
      title,
      description,
      startDate,
      endDate,
      createdBy: decoded.userId,
    });

    await newProject.save();
    res.status(201).json({ message: 'Проект успешно добавлен' });
  } catch (err) {
    logger.error('Ошибка при добавлении проекта', { error: err });
    res.status(500).json({ message: 'Произошла ошибка при добавлении проекта' });
  }
});

// Маршрут для регистрации (POST)
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Попытка регистрации с уже существующим email', { email });
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    logger.info('Пользователь зарегистрирован', { email });

    // Создаем JWT токен для нового пользователя
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });

  } catch (err) {
    logger.error('Ошибка при регистрации', { error: err });
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Маршрут для получения проектов (GET)
app.get('/api/projects', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    logger.warn('Попытка доступа к проектам без токена авторизации');
    return res.status(403).json({ message: 'Нет авторизации' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const projects = [
      { _id: '1', title: 'Проект 1', description: 'Описание проекта 1' },
      { _id: '2', title: 'Проект 2', description: 'Описание проекта 2' },
    ];
    logger.info('Данные о проектах отправлены пользователю', { userId: decoded.userId });
    res.json({ projects });
  } catch (err) {
    logger.error('Ошибка при верификации токена', { error: err });
    res.status(401).json({ message: 'Неверный токен' });
  }
});
// Маршрут для создания проектов
// Маршрут для создания проектов (POST)
app.post('/api/projects', async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  const token = req.headers['authorization']?.split(' ')[1];  // Получаем токен из заголовка

  if (!token) {
    return res.status(403).json({ message: 'Нет авторизации' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Проверяем токен

    const newProject = new Project({
      title,
      description,
      startDate,
      endDate,
      createdBy: decoded.userId,  // Сохраняем ID пользователя, который создает проект
    });

    await newProject.save();  // Сохраняем новый проект в базе данных
    res.status(201).json({ message: 'Проект успешно добавлен' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Произошла ошибка при добавлении проекта' });
  }
});

// server.js

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Неверный email или пароль' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ message: 'Неверный email или пароль' });

    // Создаем JWT токен с ролью
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Маршрут для получения проектов (GET)
app.get('/api/projects', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    logger.warn('Попытка доступа к проектам без токена авторизации');
    return res.status(403).json({ message: 'Нет авторизации' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Получаем проекты для текущего пользователя
    const projects = await Project.find({ createdBy: decoded.userId });

    logger.info('Данные о проектах отправлены пользователю', { userId: decoded.userId });
    res.json({ projects });
  } catch (err) {
    logger.error('Ошибка при верификации токена', { error: err });
    res.status(401).json({ message: 'Неверный токен' });
  }
});


// Прочие маршруты, например, отдача index.html
app.get('/', (req, res) => {
  logger.info('Запрос к главной странице');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера на порту 5434
const PORT = process.env.PORT || 5434;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

