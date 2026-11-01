const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET pending provider verification requests
router.get('/verifications', (req, res) => {
  try {
    const verifications = db.prepare(`
      SELECT t.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.avatar,
             c.name as category_name
      FROM technicians t
      JOIN users u ON t.user_id = u.id
      JOIN categories c ON t.category_id = c.id
      ORDER BY t.verified ASC, t.created_at DESC
    `).all();

    res.json({ success: true, verifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH approve/reject technician verification
router.patch('/verifications/:techId', (req, res) => {
  try {
    const { status } = req.body; // 1: approve, 2: reject
    const techId = req.params.techId;

    if (![1, 2].includes(Number(status))) {
      return res.status(400).json({ success: false, error: 'Status must be 1 (Approved) or 2 (Rejected)' });
    }

    db.prepare(`
      UPDATE technicians
      SET verified = ?
      WHERE id = ?
    `).run(Number(status), techId);

    const updatedTech = db.prepare('SELECT * FROM technicians WHERE id = ?').get(techId);

    res.json({
      success: true,
      technician: updatedTech,
      message: `Technician verification status updated to ${status === 1 ? 'Approved' : 'Rejected'}`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all complaints
router.get('/complaints', (req, res) => {
  try {
    const complaints = db.prepare(`
      SELECT cmp.*, u.name as user_name, u.email as user_email, u.role as user_role,
             b.booking_date, b.total_price, b.status as booking_status,
             t.business_name as technician_business
      FROM complaints cmp
      JOIN users u ON cmp.user_id = u.id
      JOIN bookings b ON cmp.booking_id = b.id
      JOIN technicians t ON b.technician_id = t.id
      ORDER BY cmp.created_at DESC
    `).all();

    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST submit a complaint (Customer or Tech)
router.post('/complaints', (req, res) => {
  try {
    const { booking_id, user_id, subject, description } = req.body;
    if (!booking_id || !user_id || !subject || !description) {
      return res.status(400).json({ success: false, error: 'Booking ID, User ID, subject, and description are required' });
    }

    const result = db.prepare(`
      INSERT INTO complaints (booking_id, user_id, subject, description, status)
      VALUES (?, ?, ?, ?, 'open')
    `).run(booking_id, user_id, subject, description);

    const newComplaint = db.prepare('SELECT * FROM complaints WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, complaint: newComplaint, message: 'Complaint ticket submitted to Admin queue.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH resolve/update complaint
router.patch('/complaints/:id', (req, res) => {
  try {
    const { status, resolution_notes } = req.body;
    const complaintId = req.params.id;

    db.prepare(`
      UPDATE complaints
      SET status = COALESCE(?, status),
          resolution_notes = COALESCE(?, resolution_notes)
      WHERE id = ?
    `).run(status, resolution_notes, complaintId);

    const updated = db.prepare('SELECT * FROM complaints WHERE id = ?').get(complaintId);
    res.json({ success: true, complaint: updated, message: 'Complaint updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
