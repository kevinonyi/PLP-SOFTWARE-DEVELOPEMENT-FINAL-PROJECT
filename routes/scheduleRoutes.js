// routes/scheduleRoutes.js
const express = require('express');
const scheduleController = require('../controllers/scheduleController');
const router = express.Router();

// Route for doctors to set their schedule
router.post('/set', (req, res) => {
    if (req.session.user && req.session.user.role === 'doctor') {
        scheduleController.setSchedule(req, res);
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});

// Route for patients to view available schedules
router.get('/available', (req, res) => {
    scheduleController.getAvailableSchedules(req, res);
});

module.exports = router;
