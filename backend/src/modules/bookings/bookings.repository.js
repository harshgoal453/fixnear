const db = require('../../db/database');

class BookingsRepository {
  findFiltered({ customer_id, technician_id, status }) {
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

    return db.prepare(query).all(...params);
  }

  findById(id) {
    return db.prepare(`
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
    `).get(id);
  }

  create({ customer_id, technician_id, service_category_id, booking_date, time_slot, address, notes, total_price }) {
    const result = db.prepare(`
      INSERT INTO bookings (customer_id, technician_id, service_category_id, booking_date, time_slot, address, notes, status, total_price, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'requested', ?, 'pending')
    `).run(customer_id, technician_id, service_category_id, booking_date, time_slot, address, notes || '', total_price || 999.00);

    return this.findById(result.lastInsertRowid);
  }

  updateStatus(id, { status, payment_status, completion_notes }) {
    db.prepare(`
      UPDATE bookings
      SET status = ?,
          payment_status = ?,
          completion_notes = COALESCE(?, completion_notes)
      WHERE id = ?
    `).run(status, payment_status, completion_notes, id);

    return this.findById(id);
  }
}

module.exports = new BookingsRepository();
