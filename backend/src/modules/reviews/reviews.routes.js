const express = require('express');
const router = express.Router();
const reviewsController = require('./reviews.controller');

router.post('/', reviewsController.create);

module.exports = router;
