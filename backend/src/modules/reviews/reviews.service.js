const reviewsRepository = require('./reviews.repository');
const bookingsRepository = require('../bookings/bookings.repository');

class ReviewsService {
  async createReview({ booking_id, customer_id, rating, comment }) {
    if (!booking_id || !customer_id || !rating) {
      throw new Error('Booking ID, Customer ID, and rating (1-5) are required');
    }

    const booking = bookingsRepository.findById(booking_id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status !== 'completed') {
      throw new Error('Only completed bookings can be reviewed');
    }

    const review = reviewsRepository.create({
      booking_id,
      customer_id,
      technician_id: booking.technician_id,
      rating: Number(rating),
      comment
    });

    reviewsRepository.updateTechnicianRatingStats(booking.technician_id);

    return review;
  }
}

module.exports = new ReviewsService();
