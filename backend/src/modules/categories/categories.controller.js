const categoriesService = require('./categories.service');

class CategoriesController {
  async getAll(req, res) {
    try {
      const categories = await categoriesService.getAllCategories();
      res.json({ success: true, categories });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async create(req, res) {
    try {
      const category = await categoriesService.createCategory(req.body);
      res.status(201).json({ success: true, category });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new CategoriesController();
