const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST submit a review for a booking
router.post('/', (req, res) => {
  try {
    const { booking_id, customer_id, rating, comment } = req.body;

    if (!booking_id || !customer_id || !rating) {
      return res.status(400).json({ success: false, error: 'Booking ID, Customer ID, and rating (1-5) are required' });
    }

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ success: false, error: 'Only completed bookings can be reviewed' });
    }

    // Insert review
    const result = db.prepare(`
      INSERT INTO reviews (booking_id, customer_id, technician_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `).run(booking_id, customer_id, booking.technician_id, Number(rating), comment || '');

    // Re-calculate average rating and review count for technician
    const stats = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(id) as total_reviews
      FROM reviews
      WHERE technician_id = ?
    `).get(booking.technician_id);

    const roundedRating = Math.round((stats.avg_rating || 5.0) * 10) / 10;

    db.prepare(`
      UPDATE technicians
      SET rating = ?,
          review_count = ?
      WHERE id = ?
    `).run(roundedRating, stats.total_reviews, booking.technician_id);

    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      review: newReview,
      message: 'Thank you! Your feedback has been submitted.'
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed: reviews.booking_id')) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this booking.' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
