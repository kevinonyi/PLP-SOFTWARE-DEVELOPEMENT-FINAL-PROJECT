// routes/appointmentsRoutes.js
const express = require("express");
const { bookAppointment, getAppointments, cancelAppointment } = require("../controllers/appointmentsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/book", authMiddleware, bookAppointment);           // Book an appointment
router.get("/my-appointments", authMiddleware, getAppointments); // Get appointments for logged-in user
router.delete("/cancel/:appointmentId", authMiddleware, cancelAppointment); // Cancel appointment

module.exports = router;
