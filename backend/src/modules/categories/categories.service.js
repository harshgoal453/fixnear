const categoriesRepository = require('./categories.repository');

class CategoriesService {
  async getAllCategories() {
    return categoriesRepository.findAllWithCounts();
  }

  async createCategory({ name, icon, description, base_price, popular }) {
    if (!name || !icon) {
      throw new Error('Category name and icon are required');
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return categoriesRepository.create({
      name,
      slug,
      icon,
      description: description || '',
      base_price: base_price || 499.00,
      popular: popular ? 1 : 0
    });
  }
}

module.exports = new CategoriesService();
