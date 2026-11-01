const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');

router.get('/verifications', adminController.getVerifications);
router.patch('/verifications/:techId', adminController.updateVerification);
router.get('/complaints', adminController.getComplaints);
router.post('/complaints', adminController.createComplaint);
router.patch('/complaints/:id', adminController.updateComplaint);

module.exports = router;
