// controllers/doctorsController.js
const db = require("../config/db");

// Add schedule for doctor
exports.addSchedule = (req, res) => {
  const { availableDate, availableTime } = req.body;
  const doctorId = req.session.user.id;

  db.query(
    "INSERT INTO doctor_schedule (doctor_id, available_date, available_time) VALUES (?, ?, ?)",
    [doctorId, availableDate, availableTime],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      res.status(201).json({ message: "Schedule added successfully" });
    }
  );
};

// Get doctor's schedule
exports.getDoctorSchedule = (req, res) => {
  db.query(
    "SELECT * FROM doctor_schedule WHERE doctor_id = ?",
    [req.params.doctorId],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      res.json(results);
    }
  );
};
