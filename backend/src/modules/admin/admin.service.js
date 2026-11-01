const adminRepository = require('./admin.repository');

class AdminService {
  async getVerifications() {
    return adminRepository.findVerifications();
  }

  async updateVerification(techId, status) {
    if (![1, 2].includes(Number(status))) {
      throw new Error('Status must be 1 (Approved) or 2 (Rejected)');
    }
    return adminRepository.updateVerification(techId, status);
  }

  async getComplaints() {
    return adminRepository.findComplaints();
  }

  async createComplaint({ booking_id, user_id, subject, description }) {
    if (!booking_id || !user_id || !subject || !description) {
      throw new Error('Booking ID, User ID, subject, and description are required');
    }
    return adminRepository.createComplaint({ booking_id, user_id, subject, description });
  }

  async updateComplaint(id, { status, resolution_notes }) {
    return adminRepository.updateComplaint(id, { status, resolution_notes });
  }
}

module.exports = new AdminService();
