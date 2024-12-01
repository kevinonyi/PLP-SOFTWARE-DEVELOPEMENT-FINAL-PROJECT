// app.js
const express = require("express");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const appointmentsRoutes = require("./routes/appointmentsRoutes");
const doctorsRoutes = require("./routes/doctorsRoutes");
const scheduleRoutes = require('./routes/scheduleRoutes');
const adminRoutes = require('./routes/adminRoutes');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Serve static assets
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.set("pages", path.join(__dirname, "pages"));

// Use routes
app.use("/auth", authRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/doctors", doctorsRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/admin', adminRoutes);
// Serve homepage
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "pages", "index.html")));

// Example of serving login and registration pages
app.get("/auth/login", (req, res) => res.sendFile(path.join(__dirname, "pages", "login.html")));
app.get("/auth/register", (req, res) => res.sendFile(path.join(__dirname, "pages", "registration.html")));

// Serve dashboard
app.get('/dashboard', (req, res) => {
  if (req.session.user && req.session.user.role === 'patient') {
    res.sendFile(path.join(__dirname, 'pages', 'dashboard.html'));
  } else {
    res.redirect('/auth/login'); // Redirect to login if not authenticated
  }
});

app.get('/doctor-dashboard', (req, res) => {
  if (req.session.user && req.session.user.role === 'doctor') {
    res.sendFile(path.join(__dirname, 'pages', 'doctorDashboard.html'));
  } else {
    res.redirect('/auth/login'); // Redirect to login if not authenticated
  }
});
// Serve admin dashboard
app.get("/dashboard", (req, res) => {
  if (req.session.user && req.session.user.role === "admin") {
    res.sendFile(path.join(__dirname, "pages", "adminaDshboard.html"));
  } else {
    res.redirect("/auth/login"); // Redirect to login if not authenticated
  }
});
const bcrypt = require('bcrypt');





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
