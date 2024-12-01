const bcrypt = require("bcrypt");
const db = require("../config/db");

// Register new users
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate role
  if (!['patient', 'doctor', 'admin'].includes(role)) {
    return res.status(400).json({ error: "Invalid role provided" });
  }

  // Check if email is already registered
  db.query("SELECT * FROM users WHERE email = ?", [email], async (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    if (results.length > 0) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    try {
      // Hash password and insert user into the database
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role],
        (error, results) => {
          if (error) return res.status(500).json({ error: error.message });
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// User login
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    if (results.length === 0) return res.status(401).json({ error: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    req.session.user = { id: user.id, role: user.role, name: user.name };
    
    // Redirect based on role
    if (user.role === "patient") {
      return res.redirect("/dashboard");
    } else if (user.role === "admin") {
      return res.redirect("/admin/dashboard");
    } else if (user.role === "doctor") {
      return res.redirect("/doctor-dashboard");
    }
  });
};

// Forgot password page
exports.forgotPassword = (req, res) => {
  res.send(`
    <h1>Forgot Password</h1>
    <form action="/auth/reset-password" method="POST">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br>
      <button type="submit">Reset Password</button>
    </form>
  `);
};

// Reset password functionality
exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  // Wrap db.query in a Promise for async/await compatibility
  const findUser = () =>
    new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

  const updatePassword = (hashedPassword) =>
    new Promise((resolve, reject) => {
      db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

  try {
    const user = await findUser();
    if (user.length === 0) {
      return res.status(400).send("Email not found");
    }

    const newPassword = "newRandomPassword123";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updatePassword(hashedPassword);
    res.send("Password has been reset successfully! Your new password is: " + newPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Error during logout" });
    }
    res.json({ message: "Logout successful" });
  });
};
