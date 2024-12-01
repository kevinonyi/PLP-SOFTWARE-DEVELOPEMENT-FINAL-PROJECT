// controllers/scheduleController.js
const db = require('../config/db');

// Doctor sets their availability
exports.setSchedule = (req, res) => {
    const doctorId = req.session.user.id;
    const { date, start_time, end_time } = req.body;

    db.query(
        'INSERT INTO doctor_schedule (doctor_id, date, start_time, end_time) VALUES (?, ?, ?, ?)',
        [doctorId, date, start_time, end_time],
        (error, results) => {
            if (error) return res.status(500).json({ error: error.message });
            res.json({ message: 'Schedule added successfully' });
        }
    );
};

// Get available schedules for patients
exports.getAvailableSchedules = (req, res) => {
    const { date } = req.query;

    db.query(
        `SELECT u.name AS doctor_name, s.date, s.start_time, s.end_time 
         FROM doctor_schedule s 
         JOIN users u ON s.doctor_id = u.id 
         WHERE s.date = ? 
         ORDER BY s.start_time`,
        [date],
        (error, results) => {
            if (error) return res.status(500).json({ error: error.message });
            res.json(results); // Return available schedules with doctor names
        }
    );
};
