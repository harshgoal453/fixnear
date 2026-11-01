const db = require('../../db/database');

class AdminRepository {
  findVerifications() {
    return db.prepare(`
      SELECT t.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.avatar,
             c.name as category_name
      FROM technicians t
      JOIN users u ON t.user_id = u.id
      JOIN categories c ON t.category_id = c.id
      ORDER BY t.verified ASC, t.created_at DESC
    `).all();
  }

  updateVerification(techId, status) {
    db.prepare(`
      UPDATE technicians
      SET verified = ?
      WHERE id = ?
    `).run(Number(status), techId);

    return db.prepare('SELECT * FROM technicians WHERE id = ?').get(techId);
  }

  findComplaints() {
    return db.prepare(`
      SELECT cmp.*, u.name as user_name, u.email as user_email, u.role as user_role,
             b.booking_date, b.total_price, b.status as booking_status,
             t.business_name as technician_business
      FROM complaints cmp
      JOIN users u ON cmp.user_id = u.id
      JOIN bookings b ON cmp.booking_id = b.id
      JOIN technicians t ON b.technician_id = t.id
      ORDER BY cmp.created_at DESC
    `).all();
  }

  createComplaint({ booking_id, user_id, subject, description }) {
    const result = db.prepare(`
      INSERT INTO complaints (booking_id, user_id, subject, description, status)
      VALUES (?, ?, ?, ?, 'open')
    `).run(booking_id, user_id, subject, description);

    return db.prepare('SELECT * FROM complaints WHERE id = ?').get(result.lastInsertRowid);
  }

  updateComplaint(id, { status, resolution_notes }) {
    db.prepare(`
      UPDATE complaints
      SET status = COALESCE(?, status),
          resolution_notes = COALESCE(?, resolution_notes)
      WHERE id = ?
    `).run(status, resolution_notes, id);

    return db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
  }
}

module.exports = new AdminRepository();
