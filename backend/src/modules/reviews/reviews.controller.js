const reviewsService = require('./reviews.service');

class ReviewsController {
  async create(req, res) {
    try {
      const review = await reviewsService.createReview(req.body);
      res.status(201).json({
        success: true,
        review,
        message: 'Thank you! Your feedback has been submitted.'
      });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed: reviews.booking_id')) {
        return res.status(400).json({ success: false, error: 'You have already reviewed this booking.' });
      }
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new ReviewsController();
