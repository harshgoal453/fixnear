const db = require('../../db/database');

class CategoriesRepository {
  findAllWithCounts() {
    return db.prepare(`
      SELECT c.*, COUNT(t.id) as technician_count
      FROM categories c
      LEFT JOIN technicians t ON c.id = t.category_id AND t.verified = 1
      GROUP BY c.id
      ORDER BY c.popular DESC, c.name ASC
    `).all();
  }

  findById(id) {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  }

  create({ name, slug, icon, description, base_price, popular }) {
    const result = db.prepare(`
      INSERT INTO categories (name, slug, icon, description, base_price, popular)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, slug, icon, description, base_price, popular);

    return this.findById(result.lastInsertRowid);
  }
}

module.exports = new CategoriesRepository();
