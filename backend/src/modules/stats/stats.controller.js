const statsService = require('./stats.service');

class StatsController {
  async getOverview(req, res) {
    try {
      const stats = await statsService.getOverview();
      res.json({ success: true, stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new StatsController();
