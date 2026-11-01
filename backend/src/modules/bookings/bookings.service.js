const bookingsRepository = require('./bookings.repository');

class BookingsService {
  async getBookings(filters) {
    return bookingsRepository.findFiltered(filters);
  }

  async getBookingById(id) {
    const booking = bookingsRepository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async createBooking(data) {
    const { customer_id, technician_id, service_category_id, booking_date, time_slot, address } = data;
    if (!customer_id || !technician_id || !service_category_id || !booking_date || !time_slot || !address) {
      throw new Error('Missing required booking fields');
    }
    return bookingsRepository.create(data);
  }

  async updateBookingStatus(id, { status, completion_notes, payment_status }) {
    const booking = bookingsRepository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const allowedStatuses = ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      throw new Error('Invalid booking status');
    }

    const newStatus = status || booking.status;
    const newPaymentStatus = payment_status || (newStatus === 'completed' ? 'paid' : booking.payment_status);

    return bookingsRepository.updateStatus(id, {
      status: newStatus,
      payment_status: newPaymentStatus,
      completion_notes
    });
  }
}

module.exports = new BookingsService();
