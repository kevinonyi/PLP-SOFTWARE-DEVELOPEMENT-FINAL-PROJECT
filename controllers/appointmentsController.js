const db = require("../config/db");
const moment = require('moment');

// Book an appointment
exports.bookAppointment = (req, res) => {
  const patientId = req.session.user.id;
  const { doctorName, date, time } = req.body;

  // Format the date and time for MySQL
  const formattedDate = moment(date).format('YYYY-MM-DD');
  const formattedTime = moment(time, 'HH:mm').format('HH:mm:ss');

  // Find doctor ID based on doctor name
  db.query(
      'SELECT id FROM users WHERE name = ? AND role = "doctor"',
      [doctorName],
      (error, results) => {
          if (error) return res.status(500).json({ error: error.message });
          if (results.length === 0) return res.status(404).json({ error: 'Doctor not found' });

          const doctorId = results[0].id;

          // Insert the appointment with the found doctor ID
          db.query(
              'INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
              [patientId, doctorId, formattedDate, formattedTime, 'scheduled'],
              (error, results) => {
                  if (error) return res.status(500).json({ error: error.message });
                  res.json({ message: 'Appointment booked successfully' });
              }
          );
      }
  );
};

// Get appointments for logged-in user
exports.getAppointments = (req, res) => {
  const userId = req.session.user.id;
  const role = req.session.user.role; // Fix: Defined 'role' properly
  console.log(`Fetching appointments for user: ${userId}, role: ${role}`);

  // Fix: Properly structure the ternary operator with parentheses
  const query = role === 'doctor'
    ? "SELECT * FROM appointments WHERE doctor_id = ? AND status = 'scheduled'"
    : "SELECT * FROM appointments WHERE user_id = ? AND status = 'scheduled'";

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching appointments:", error.message); // Fix: Added missing curly braces for the if block
      return res.status(500).json({ error: error.message });
    }

    console.log("Fetched appointments:", results);
    res.json(results);
  });
};

// Cancel an appointment
exports.cancelAppointment = (req, res) => {
  const { appointmentId } = req.params;
  db.query(
    "UPDATE appointments SET status = 'canceled' WHERE id = ?",
    [appointmentId],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      res.json({ message: "Appointment canceled successfully" });
    }
  );
};
