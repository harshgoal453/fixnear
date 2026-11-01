const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/auth.routes');
const categoryRoutes = require('../modules/categories/categories.routes');
const technicianRoutes = require('../modules/technicians/technicians.routes');
const bookingRoutes = require('../modules/bookings/bookings.routes');
const reviewRoutes = require('../modules/reviews/reviews.routes');
const adminRoutes = require('../modules/admin/admin.routes');
const statsRoutes = require('../modules/stats/stats.routes');
const paymentRoutes = require('../modules/payments/payments.routes');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/technicians', technicianRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);
router.use('/stats', statsRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
