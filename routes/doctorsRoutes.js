// routes/doctorsRoutes.js
const express = require("express");
const { addSchedule, getDoctorSchedule } = require("../controllers/doctorsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/schedule", authMiddleware, addSchedule);       // Doctor adds schedule
router.get("/:doctorId/schedule", getDoctorSchedule);        // Get a doctor's schedule

module.exports = router;
