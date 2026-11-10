const authService = require('./auth.service');

class AuthController {
  async getUsers(req, res) {
    try {
      const users = await authService.getAllUsers();
      res.json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async sendOtp(req, res) {
    try {
      const { type, target } = req.body;
      const result = await authService.sendOtp(type, target);
      res.json(result);
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      const { type, target, otp } = req.body;
      const result = await authService.verifyOtp(type, target, otp);
      res.json(result);
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res.json({ success: true, user, token });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 401;
      res.status(statusCode).json({ success: false, error: error.message });
    }
  }

  async register(req, res) {
    try {
      const { user, token } = await authService.register(req.body);
      res.status(201).json({ success: true, user, token, message: 'Account registered successfully!' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async me(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Authorization header missing' });
      }
      const token = authHeader.split(' ')[1];
      const decoded = authService.verifyToken(token);
      res.json({ success: true, user: decoded });
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  }
}

module.exports = new AuthController();
