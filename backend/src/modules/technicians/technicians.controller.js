const techniciansService = require('./technicians.service');

class TechniciansController {
  async getList(req, res) {
    try {
      const technicians = await techniciansService.getTechnicians(req.query);
      res.json({ success: true, technicians });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getDetail(req, res) {
    try {
      const data = await techniciansService.getTechnicianById(req.params.id);
      res.json({ success: true, ...data });
    } catch (error) {
      const statusCode = error.message === 'Technician profile not found' ? 404 : 500;
      res.status(statusCode).json({ success: false, error: error.message });
    }
  }

  async update(req, res) {
    try {
      const technician = await techniciansService.updateTechnician(req.params.id, req.body);
      res.json({ success: true, technician, message: 'Profile updated successfully' });
    } catch (error) {
      const statusCode = error.message === 'Technician not found' ? 404 : 500;
      res.status(statusCode).json({ success: false, error: error.message });
    }
  }
}

module.exports = new TechniciansController();
