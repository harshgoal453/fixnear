const db = require('../../db/database');

class StatsRepository {
  getOverviewMetrics() {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalProviders = db.prepare('SELECT COUNT(*) as count FROM technicians').get().count;
    const verifiedProviders = db.prepare('SELECT COUNT(*) as count FROM technicians WHERE verified = 1').get().count;
    const pendingVerifications = db.prepare('SELECT COUNT(*) as count FROM technicians WHERE verified = 0').get().count;

    const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
    const activeBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status IN ('requested', 'accepted', 'in_progress')").get().count;
    const completedBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'").get().count;

    const totalRevenue = db.prepare("SELECT SUM(total_price) as total FROM bookings WHERE payment_status = 'paid'").get().total || 0;
    const openComplaints = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'open'").get().count;
    const avgPlatformRating = db.prepare("SELECT AVG(rating) as avg FROM reviews").get().avg || 4.8;

    return {
      totalUsers,
      totalProviders,
      verifiedProviders,
      pendingVerifications,
      totalBookings,
      activeBookings,
      completedBookings,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      openComplaints,
      avgPlatformRating: Math.round(avgPlatformRating * 10) / 10
    };
  }
}

module.exports = new StatsRepository();
