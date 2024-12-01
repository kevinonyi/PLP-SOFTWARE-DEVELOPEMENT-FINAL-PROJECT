const express = require("express");
const { register, login, logout, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);         // Register new user
router.post("/login", login);               // User login
router.post("/logout", logout);             // User logout

// Password reset routes
router.get("/forgot-password", forgotPassword);   // Show forgot password page
router.post("/reset-password", resetPassword);    // Reset password with token

module.exports = router;
