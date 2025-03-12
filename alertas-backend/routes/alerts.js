const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');
const messageRoutes = require('./messages');

router.get('/locations', alertController.getAlertLocations);
router.get('/frequency', alertController.getAlertFrequencyByMonth);
router.get('/group/:groupId/', alertController.getAlertsByGroup);
router.get('/', alertController.getAlerts);

router.post('/', alertController.createAlert);
router.put('/:id', alertController.updateAlert);
router.delete('/:id', alertController.deleteAlert);

router.use('/:alertId/messages', messageRoutes);

module.exports = router;