const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();
const path = require('path');
// Middleware to check if the user is admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
}
// Admin dashboard
router.get('/dashboard', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'adminDashboard.html'));
});
// Get all doctors and patients (admin only)
router.get('/users', isAdmin, adminController.getAllUsers);

// Add a new doctor (admin only)
router.post('/doctor/add', isAdmin, adminController.addDoctor);

// Delete a user by ID (admin only)
router.delete('/user/:id', isAdmin, adminController.deleteUser);

module.exports = router;
