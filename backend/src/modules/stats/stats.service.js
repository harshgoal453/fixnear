const statsRepository = require('./stats.repository');

class StatsService {
  async getOverview() {
    return statsRepository.getOverviewMetrics();
  }
}

module.exports = new StatsService();
