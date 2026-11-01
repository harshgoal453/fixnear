const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Strict CORS Configuration - Supports Localhost, Custom Domain, & Vercel Preview Deployments
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like reverse proxy / server-to-server / health checks)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isVercelPreview = origin.endsWith('.vercel.app');

    if (isExplicitlyAllowed || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Policy Violation: Origin ${origin} is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Centralized Router Entry Point
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FixNear Modularized Backend API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FixNear Modularized Backend Server running on port ${PORT}`);
});
