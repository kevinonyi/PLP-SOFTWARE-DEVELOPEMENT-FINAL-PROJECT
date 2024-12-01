const db = require('../config/db');
const bcrypt = require('bcrypt');

// Get all doctors and patients for admin dashboard
exports.getAllUsers = (req, res) => {
    db.query('SELECT id, name, role FROM users', (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(results);
    });
};

// Add a new doctor
exports.addDoctor = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'doctor';

    db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role],
        (error, results) => {
            if (error) return res.status(500).json({ error: error.message });
            res.json({ message: 'Doctor added successfully' });
        });
};

// Delete a user by ID
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: 'User deleted successfully' });
    });
};
