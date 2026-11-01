const express = require('express');
const router = express.Router();
const statsController = require('./stats.controller');

router.get('/', statsController.getOverview);
router.get('/overview', statsController.getOverview);

module.exports = router;
