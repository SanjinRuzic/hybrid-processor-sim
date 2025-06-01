const express = require('express');
const ProcessorController = require('../controllers/processorController');

const router = express.Router();
router.get('/status', ProcessorController.getStatus);
router.post('/execute', ProcessorController.executeTask);
router.post('/start', ProcessorController.startProcessor);
router.post('/stop', ProcessorController.stopProcessor);
router.get('/history', ProcessorController.getHistory);
router.delete('/history', ProcessorController.clearHistory);
router.post('/reset', ProcessorController.resetProcessor);
router.get('/algorithms', ProcessorController.getAlgorithms);
router.get('/performance', ProcessorController.getPerformance);
router.post('/circuit', ProcessorController.executeCircuit);
router.get('/metrics', ProcessorController.getMetrics);

module.exports = router;