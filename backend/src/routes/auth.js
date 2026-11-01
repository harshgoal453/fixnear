const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all users (useful for role switcher demo)
router.get('/users', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT u.*, t.id as technician_id, t.verified as tech_verified, t.business_name, c.name as category_name
      FROM users u
      LEFT JOIN technicians t ON u.id = t.user_id
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY u.id ASC
    `).all();

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST login / user selection
router.post('/login', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const user = db.prepare(`
      SELECT u.*, t.id as technician_id, t.verified as tech_verified, t.business_name
      FROM users u
      LEFT JOIN technicians t ON u.id = t.user_id
      WHERE u.email = ?
    `).get(email);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
