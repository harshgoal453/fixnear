const express = require('express');
const router = express.Router();
const categoriesController = require('./categories.controller');

router.get('/', categoriesController.getAll);
router.post('/', categoriesController.create);

module.exports = router;
