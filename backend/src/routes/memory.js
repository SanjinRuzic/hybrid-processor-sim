const express = require('express');
const MemoryController = require('../controllers/memoryController');

const router = express.Router();

router.get('/status', MemoryController.getMemoryStatus);
router.get('/quantum', MemoryController.getQuantumState);
router.post('/quantum', MemoryController.quantumOperation);
router.post('/classical', MemoryController.classicalOperation);
router.get('/quantum/states', MemoryController.getAllQuantumStates);
router.post('/quantum/entangle', MemoryController.entangleQubits);
router.post('/quantum/measure', MemoryController.measureQubit);
router.get('/quantum/stats', MemoryController.getQuantumStats);
router.post('/quantum/gate', MemoryController.applyQuantumGate);

module.exports = router;