// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { authenticateToken, requireAdmin } = require("../middleware/authMiddleware");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get("/logout", AuthController.logout);

// Пример защищенного маршрута для администратора
router.get("/admin", authenticateToken, requireAdmin, (req, res) => {
  res.render("adminDashboard");  // Страница для админа
});

module.exports = router;
