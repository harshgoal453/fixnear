const db = require('../../db/database');

class TechniciansRepository {
  findFiltered({ category, city, verified, min_rating, search, status }) {
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

    return db.prepare(query).all(...params);
  }

  findById(id) {
    return db.prepare(`
      SELECT t.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.avatar,
             c.name as category_name, c.slug as category_slug, c.icon as category_icon, c.base_price
      FROM technicians t
      JOIN users u ON t.user_id = u.id
      JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(id);
  }

  findReviewsByTechId(techId) {
    return db.prepare(`
      SELECT r.*, u.name as customer_name, u.avatar as customer_avatar
      FROM reviews r
      JOIN users u ON r.customer_id = u.id
      WHERE r.technician_id = ?
      ORDER BY r.created_at DESC
    `).all(techId);
  }

  update(id, data) {
    const { business_name, bio, hourly_rate, city, address, skills, availability_status, verification_doc, verified } = data;
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
          verified = COALESCE(?, verified)
      WHERE id = ?
    `).run(
      business_name, bio, hourly_rate, city, address,
      skills ? JSON.stringify(skills) : null,
      availability_status, verification_doc, verified, id
    );

    return this.findById(id);
  }
}

module.exports = new TechniciansRepository();
