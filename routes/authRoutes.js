// routes/auth.js
const express = require("express");
const router = express.Router();
const { logout, handleLogin } = require("../controllers/authController");

// Handle login (Form submission)
router.post("/login", handleLogin); // ✅ Use only one handler

// Handle logout
router.get("/logout", logout);

module.exports = router;
