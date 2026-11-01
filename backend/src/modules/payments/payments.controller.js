const paymentsService = require('./payments.service');

class PaymentsController {
  async createOrder(req, res) {
    try {
      const order = await paymentsService.createOrder(req.body);
      res.json({ success: true, ...order });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async verifyPayment(req, res) {
    try {
      const result = await paymentsService.verifyPayment(req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new PaymentsController();
