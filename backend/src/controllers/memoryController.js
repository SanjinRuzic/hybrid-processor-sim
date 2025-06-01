const HybridProcessor = require('../models/HybridProcessor');

// Use the same processor instance
let processor = require('./processorController');

class MemoryController {
  // Get memory status
  static async getMemoryStatus(req, res) {
    try {
      const memoryUsage = processor.processor?.getMemoryUsage() || {
        quantum: { qubits: 0, activeStates: 0, entanglements: 0, coherenceTime: 0 },
        classical: { totalMemory: 0, usedMemory: 0, cacheHitRate: 0, performance: {} }
      };

      res.json({
        success: true,
        data: memoryUsage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get quantum state (single)
  static async getQuantumState(req, res) {
    try {
      const tempProcessor = new HybridProcessor();
      const quantumState = tempProcessor.quantumMemory.getQuantumState();

      res.json({
        success: true,
        data: quantumState,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get all quantum states
  static async getAllQuantumStates(req, res) {
    try {
      const tempProcessor = new HybridProcessor();
      const allStates = tempProcessor.quantumMemory.getAllStates(); // assuming this method exists

      res.json({
        success: true,
        data: allStates,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get quantum stats
  static async getQuantumStats(req, res) {
    try {
      const tempProcessor = new HybridProcessor();
      const stats = tempProcessor.quantumMemory.getStats(); // assuming this method exists

      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Manipulate quantum memory: generic operation handler
  static async quantumOperation(req, res) {
    try {
      const { operation, qubitIndex, parameters } = req.body;

      if (!operation) {
        return res.status(400).json({ success: false, error: 'Operation is required' });
      }

      const tempProcessor = new HybridProcessor();
      let result;

      switch (operation) {
        case 'CREATE_SUPERPOSITION':
          result = tempProcessor.quantumMemory.createSuperposition(
            qubitIndex,
            parameters?.alpha || 0.707,
            parameters?.beta || 0.707
          );
          break;

        case 'ENTANGLE_QUBITS':
          result = tempProcessor.quantumMemory.entangleQubits(
            parameters.qubit1,
            parameters.qubit2
          );
          break;

        case 'MEASURE_QUBIT':
          result = tempProcessor.quantumMemory.measureQubit(qubitIndex);
          break;

        case 'APPLY_GATE':
          result = tempProcessor.quantumMemory.applyGate(qubitIndex, parameters.gate);
          break;

        default:
          return res.status(400).json({ success: false, error: 'Unknown quantum operation' });
      }

      res.json({
        success: true,
        data: result,
        operation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Entangle qubits - specific route
  static async entangleQubits(req, res) {
    try {
      const { qubit1, qubit2 } = req.body;

      if (qubit1 === undefined || qubit2 === undefined) {
        return res.status(400).json({ success: false, error: 'qubit1 and qubit2 are required' });
      }

      const tempProcessor = new HybridProcessor();
      const result = tempProcessor.quantumMemory.entangleQubits(qubit1, qubit2);

      res.json({
        success: true,
        data: result,
        operation: 'ENTANGLE_QUBITS',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Measure a qubit - specific route
  static async measureQubit(req, res) {
    try {
      const { qubitIndex } = req.body;

      if (qubitIndex === undefined) {
        return res.status(400).json({ success: false, error: 'qubitIndex is required' });
      }

      const tempProcessor = new HybridProcessor();
      const result = tempProcessor.quantumMemory.measureQubit(qubitIndex);

      res.json({
        success: true,
        data: result,
        operation: 'MEASURE_QUBIT',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Apply quantum gate - specific route
  static async applyQuantumGate(req, res) {
    try {
      const { qubitIndex, gate } = req.body;

      if (qubitIndex === undefined || !gate) {
        return res.status(400).json({ success: false, error: 'qubitIndex and gate are required' });
      }

      const tempProcessor = new HybridProcessor();
      const result = tempProcessor.quantumMemory.applyGate(qubitIndex, gate);

      res.json({
        success: true,
        data: result,
        operation: 'APPLY_GATE',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Classical memory operations
  static async classicalOperation(req, res) {
    try {
      const { operation, address, data } = req.body;

      if (!operation) {
        return res.status(400).json({ success: false, error: 'Operation is required' });
      }

      const tempProcessor = new HybridProcessor();
      let result;

      switch (operation) {
        case 'WRITE':
          result = tempProcessor.classicalMemory.write(address, data);
          break;

        case 'READ':
          result = tempProcessor.classicalMemory.read(address);
          break;

        case 'GET_STATS':
          result = tempProcessor.classicalMemory.getMemoryStats();
          break;

        default:
          return res.status(400).json({ success: false, error: 'Unknown classical operation' });
      }

      res.json({
        success: true,
        data: result,
        operation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = MemoryController;
