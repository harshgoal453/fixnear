const express = require('express');
const router = express.Router();
const bookingsController = require('./bookings.controller');

router.get('/', bookingsController.getList);
router.get('/:id', bookingsController.getDetail);
router.post('/', bookingsController.create);
router.patch('/:id/status', bookingsController.updateStatus);

module.exports = router;
