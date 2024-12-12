// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware для проверки токена
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Токен не предоставлен' });

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Неавторизованный доступ' });
    req.user = user;
    next();
  });
}

// Middleware для проверки роли администратора
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Необходимы права администратора.' });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
