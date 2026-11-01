const bookingsService = require('./bookings.service');

class BookingsController {
  async getList(req, res) {
    try {
      const bookings = await bookingsService.getBookings(req.query);
      res.json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getDetail(req, res) {
    try {
      const booking = await bookingsService.getBookingById(req.params.id);
      res.json({ success: true, booking });
    } catch (error) {
      const statusCode = error.message === 'Booking not found' ? 404 : 500;
      res.status(statusCode).json({ success: false, error: error.message });
    }
  }

  async create(req, res) {
    try {
      const booking = await bookingsService.createBooking(req.body);
      res.status(201).json({ success: true, booking, message: 'Service requested successfully!' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const booking = await bookingsService.updateBookingStatus(req.params.id, req.body);
      res.json({ success: true, booking, message: `Booking status updated to ${booking.status}` });
    } catch (error) {
      const statusCode = error.message === 'Booking not found' ? 404 : 400;
      res.status(statusCode).json({ success: false, error: error.message });
    }
  }
}

module.exports = new BookingsController();
