const mongoose = require('mongoose');
require('dotenv').config();

// Подключаемся к MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));


  db.users.insertOne({
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    avatar: 'https://via.placeholder.com/100',
    role: 'Администратор'
});

db.users.insertOne({
    name: 'Мария Петрова',
    email: 'maria@example.com',
    avatar: 'https://via.placeholder.com/100',
    role: 'Пользователь'
});
