const express = require('express');
const router = express.Router();
const techniciansController = require('./technicians.controller');

router.get('/', techniciansController.getList);
router.get('/:id', techniciansController.getDetail);
router.put('/:id', techniciansController.update);

module.exports = router;
