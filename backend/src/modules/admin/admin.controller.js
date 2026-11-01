const adminService = require('./admin.service');

class AdminController {
  async getVerifications(req, res) {
    try {
      const verifications = await adminService.getVerifications();
      res.json({ success: true, verifications });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateVerification(req, res) {
    try {
      const technician = await adminService.updateVerification(req.params.techId, req.body.status);
      res.json({
        success: true,
        technician,
        message: `Technician verification status updated to ${req.body.status === 1 ? 'Approved' : 'Rejected'}`
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getComplaints(req, res) {
    try {
      const complaints = await adminService.getComplaints();
      res.json({ success: true, complaints });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createComplaint(req, res) {
    try {
      const complaint = await adminService.createComplaint(req.body);
      res.status(201).json({ success: true, complaint, message: 'Complaint ticket submitted to Admin queue.' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async updateComplaint(req, res) {
    try {
      const complaint = await adminService.updateComplaint(req.params.id, req.body);
      res.json({ success: true, complaint, message: 'Complaint updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new AdminController();
