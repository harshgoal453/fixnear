const db = require('../../db/database');

class ReviewsRepository {
  create({ booking_id, customer_id, technician_id, rating, comment }) {
    const result = db.prepare(`
      INSERT INTO reviews (booking_id, customer_id, technician_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `).run(booking_id, customer_id, technician_id, rating, comment || '');

    return db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
  }

  updateTechnicianRatingStats(technicianId) {
    const stats = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(id) as total_reviews
      FROM reviews
      WHERE technician_id = ?
    `).get(technicianId);

    const roundedRating = Math.round((stats.avg_rating || 5.0) * 10) / 10;

    db.prepare(`
      UPDATE technicians
      SET rating = ?,
          review_count = ?
      WHERE id = ?
    `).run(roundedRating, stats.total_reviews, technicianId);
  }
}

module.exports = new ReviewsRepository();
