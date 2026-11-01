const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET list technicians with filters
router.get('/', (req, res) => {
  try {
    const { category, city, verified, min_rating, search, status } = req.query;

    let query = `
      SELECT t.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.avatar,
             c.name as category_name, c.slug as category_slug, c.icon as category_icon
      FROM technicians t
      JOIN users u ON t.user_id = u.id
      JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;

    const params = [];

    if (category) {
      if (isNaN(category)) {
        query += ` AND c.slug = ?`;
        params.push(category);
      } else {
        query += ` AND t.category_id = ?`;
        params.push(Number(category));
      }
    }

    if (city) {
      query += ` AND t.city LIKE ?`;
      params.push(`%${city}%`);
    }

    if (verified !== undefined && verified !== '') {
      query += ` AND t.verified = ?`;
      params.push(Number(verified));
    }

    if (status) {
      query += ` AND t.availability_status = ?`;
      params.push(status);
    }

    if (min_rating) {
      query += ` AND t.rating >= ?`;
      params.push(Number(min_rating));
    }

    if (search) {
      query += ` AND (t.business_name LIKE ? OR u.name LIKE ? OR c.name LIKE ? OR t.skills LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    query += ` ORDER BY t.verified DESC, t.rating DESC, t.review_count DESC`;

    const technicians = db.prepare(query).all(...params);

    const formattedTechs = technicians.map(t => ({
      ...t,
      skills: JSON.parse(t.skills || '[]')
    }));

    res.json({ success: true, technicians: formattedTechs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single technician details
router.get('/:id', (req, res) => {
  try {
    const tech = db.prepare(`
      SELECT t.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.avatar,
             c.name as category_name, c.slug as category_slug, c.icon as category_icon, c.base_price
      FROM technicians t
      JOIN users u ON t.user_id = u.id
      JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(req.params.id);

    if (!tech) {
      return res.status(404).json({ success: false, error: 'Technician profile not found' });
    }

    tech.skills = JSON.parse(tech.skills || '[]');

    // Get reviews for this technician
    const reviews = db.prepare(`
      SELECT r.*, u.name as customer_name, u.avatar as customer_avatar
      FROM reviews r
      JOIN users u ON r.customer_id = u.id
      WHERE r.technician_id = ?
      ORDER BY r.created_at DESC
    `).all(tech.id);

    res.json({ success: true, technician: tech, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update technician profile or submit verification document
router.put('/:id', (req, res) => {
  try {
    const { business_name, bio, hourly_rate, city, address, skills, availability_status, verification_doc } = req.body;
    const techId = req.params.id;

    const existing = db.prepare('SELECT * FROM technicians WHERE id = ?').get(techId);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }

    let updatedVerified = existing.verified;
    // If a new verification doc is provided and tech was not verified, reset to pending (0)
    if (verification_doc && verification_doc !== existing.verification_doc && existing.verified === 2) {
      updatedVerified = 0; // re-submit for approval
    }

    db.prepare(`
      UPDATE technicians
      SET business_name = COALESCE(?, business_name),
          bio = COALESCE(?, bio),
          hourly_rate = COALESCE(?, hourly_rate),
          city = COALESCE(?, city),
          address = COALESCE(?, address),
          skills = COALESCE(?, skills),
          availability_status = COALESCE(?, availability_status),
          verification_doc = COALESCE(?, verification_doc),
          verified = ?
      WHERE id = ?
    `).run(
      business_name, bio, hourly_rate, city, address,
      skills ? JSON.stringify(skills) : null,
      availability_status, verification_doc, updatedVerified, techId
    );

    const updatedTech = db.prepare('SELECT * FROM technicians WHERE id = ?').get(techId);
    updatedTech.skills = JSON.parse(updatedTech.skills || '[]');

    res.json({ success: true, technician: updatedTech, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
