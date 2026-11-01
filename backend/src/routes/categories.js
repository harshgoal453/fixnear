const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all service categories
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(t.id) as technician_count
      FROM categories c
      LEFT JOIN technicians t ON c.id = t.category_id AND t.verified = 1
      GROUP BY c.id
      ORDER BY c.popular DESC, c.name ASC
    `).all();

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST add new category (Admin)
router.post('/', (req, res) => {
  try {
    const { name, icon, description, base_price, popular } = req.body;
    if (!name || !icon) {
      return res.status(400).json({ success: false, error: 'Category name and icon are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const result = db.prepare(`
      INSERT INTO categories (name, slug, icon, description, base_price, popular)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, slug, icon, description || '', base_price || 50.00, popular ? 1 : 0);

    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
