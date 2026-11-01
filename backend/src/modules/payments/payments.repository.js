const db = require('../../db/database');

class PaymentsRepository {
  findBookingById(bookingId) {
    return db.prepare(`
      SELECT b.*, t.business_name, c.name as customer_name, c.email as customer_email, cat.name as category_name
      FROM bookings b
      JOIN technicians t ON b.technician_id = t.id
      JOIN users c ON b.customer_id = c.id
      JOIN categories cat ON b.service_category_id = cat.id
      WHERE b.id = ?
    `).get(bookingId);
  }

  recordPaymentSuccess(bookingId, { payment_id, payment_method }) {
    db.prepare(`
      UPDATE bookings
      SET payment_status = 'paid',
          payment_id = ?,
          payment_method = ?
      WHERE id = ?
    `).run(payment_id, payment_method || 'UPI', bookingId);

    return this.findBookingById(bookingId);
  }
}

module.exports = new PaymentsRepository();
