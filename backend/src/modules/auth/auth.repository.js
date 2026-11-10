const db = require('../../db/database');

class AuthRepository {
  findAllUsers() {
    return db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.role, u.avatar, u.created_at,
             t.id as technician_id, t.verified as tech_verified, t.business_name, c.name as category_name
      FROM users u
      LEFT JOIN technicians t ON u.id = t.user_id
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY u.id ASC
    `).all();
  }

  findByEmail(email) {
    return db.prepare(`
      SELECT u.*, t.id as technician_id, t.verified as tech_verified, t.business_name
      FROM users u
      LEFT JOIN technicians t ON u.id = t.user_id
      WHERE u.email = ?
    `).get(email);
  }

  findById(id) {
    return db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.role, u.avatar, u.created_at,
             t.id as technician_id, t.verified as tech_verified, t.business_name, c.name as category_name
      FROM users u
      LEFT JOIN technicians t ON u.id = t.user_id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE u.id = ?
    `).get(id);
  }

  createUser({ name, email, password, phone, role, avatar }) {
    const result = db.prepare(`
      INSERT INTO users (name, email, password, phone, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      name,
      email,
      password,
      phone || '',
      role || 'customer',
      avatar || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150'
    );
    return this.findById(result.lastInsertRowid);
  }

  createTechnician({ user_id, business_name, category_id, bio, hourly_rate, city, address, skills, verification_doc }) {
    db.prepare(`
      INSERT INTO technicians (user_id, business_name, category_id, bio, hourly_rate, city, address, skills, verified, verification_doc, availability_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 'available')
    `).run(
      user_id,
      business_name,
      category_id || 1,
      bio || '',
      hourly_rate || 499.00,
      city || 'Mumbai, MH, India',
      address || '',
      JSON.stringify(skills || ['General Professional Service']),
      verification_doc || null
    );
    return this.findById(user_id);
  }
}

module.exports = new AuthRepository();
