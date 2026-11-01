const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET bookings list
router.get('/', (req, res) => {
  try {
    const { customer_id, technician_id, status } = req.query;

    let query = `
      SELECT b.*,
             c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.avatar as customer_avatar,
             t.business_name, t.verified as tech_verified, u_tech.name as tech_owner_name, u_tech.phone as tech_phone,
             cat.name as category_name, cat.icon as category_icon,
             r.id as review_id, r.rating as review_rating, r.comment as review_comment,
             cmp.id as complaint_id, cmp.status as complaint_status
      FROM bookings b
      JOIN users c ON b.customer_id = c.id
      JOIN technicians t ON b.technician_id = t.id
      JOIN users u_tech ON t.user_id = u_tech.id
      JOIN categories cat ON b.service_category_id = cat.id
      LEFT JOIN reviews r ON r.booking_id = b.id
      LEFT JOIN complaints cmp ON cmp.booking_id = b.id
      WHERE 1=1
    `;

    const params = [];

    if (customer_id) {
      query += ` AND b.customer_id = ?`;
      params.push(Number(customer_id));
    }

    if (technician_id) {
      query += ` AND b.technician_id = ?`;
      params.push(Number(technician_id));
    }

    if (status) {
      query += ` AND b.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY b.created_at DESC`;

    const bookings = db.prepare(query).all(...params);
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single booking
router.get('/:id', (req, res) => {
  try {
    const booking = db.prepare(`
      SELECT b.*,
             c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.avatar as customer_avatar,
             t.business_name, t.verified as tech_verified, t.hourly_rate, u_tech.name as tech_owner_name, u_tech.phone as tech_phone, u_tech.avatar as tech_avatar,
             cat.name as category_name, cat.icon as category_icon,
             r.id as review_id, r.rating as review_rating, r.comment as review_comment,
             cmp.id as complaint_id, cmp.status as complaint_status, cmp.subject as complaint_subject
      FROM bookings b
      JOIN users c ON b.customer_id = c.id
      JOIN technicians t ON b.technician_id = t.id
      JOIN users u_tech ON t.user_id = u_tech.id
      JOIN categories cat ON b.service_category_id = cat.id
      LEFT JOIN reviews r ON r.booking_id = b.id
      LEFT JOIN complaints cmp ON cmp.booking_id = b.id
      WHERE b.id = ?
    `).get(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create booking
router.post('/', (req, res) => {
  try {
    const { customer_id, technician_id, service_category_id, booking_date, time_slot, address, notes, total_price } = req.body;

    if (!customer_id || !technician_id || !service_category_id || !booking_date || !time_slot || !address) {
      return res.status(400).json({ success: false, error: 'Missing required booking fields' });
    }

    const result = db.prepare(`
      INSERT INTO bookings (customer_id, technician_id, service_category_id, booking_date, time_slot, address, notes, status, total_price, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'requested', ?, 'pending')
    `).run(customer_id, technician_id, service_category_id, booking_date, time_slot, address, notes || '', total_price || 100.00);

    const newBooking = db.prepare(`
      SELECT b.*, t.business_name, cat.name as category_name
      FROM bookings b
      JOIN technicians t ON b.technician_id = t.id
      JOIN categories cat ON b.service_category_id = cat.id
      WHERE b.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ success: true, booking: newBooking, message: 'Service requested successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH update booking status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, completion_notes, payment_status } = req.body;
    const bookingId = req.params.id;

    const allowedStatuses = ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid booking status' });
    }

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const newStatus = status || booking.status;
    const newPaymentStatus = payment_status || (newStatus === 'completed' ? 'paid' : booking.payment_status);

    db.prepare(`
      UPDATE bookings
      SET status = ?,
          payment_status = ?,
          completion_notes = COALESCE(?, completion_notes)
      WHERE id = ?
    `).run(newStatus, newPaymentStatus, completion_notes, bookingId);

    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    res.json({ success: true, booking: updated, message: `Booking status updated to ${newStatus}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
