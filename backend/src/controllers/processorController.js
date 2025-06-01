const HybridProcessor = require('../models/HybridProcessor');

// Global processor instance
let processor = new HybridProcessor({
  qubits: 16,
  memorySize: 2048,
  quantumThreshold: 0.1,
  hybridMode: true
});

class ProcessorController {
  // Get processor status
  static async getStatus(req, res) {
    try {
      const status = processor.getSystemStatus();
      res.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get available algorithms - using hardcoded list since method doesn't exist in HybridProcessor
  static async getAlgorithms(req, res) {
    try {
      const algorithms = [
        {
          name: 'Grover Search',
          type: 'QUANTUM_SEARCH',
          description: 'Quantum search algorithm for unstructured databases',
          complexity: 'O(√N)',
          qubitsRequired: 'log₂(N)'
        },
        {
          name: 'Hybrid Quantum Annealing',
          type: 'HYBRID_OPTIMIZATION',
          description: 'Quantum-classical optimization for complex problems',
          complexity: 'Problem-dependent',
          qubitsRequired: 'Variable'
        },
        {
          name: 'Quantum System Simulation',
          type: 'QUANTUM_SIMULATION',
          description: 'Simulate quantum many-body systems',
          complexity: 'Exponential',
          qubitsRequired: 'System size'
        },
        {
          name: 'Hybrid Parallel Processing',
          type: 'PARALLEL_COMPUTATION',
          description: 'Parallel quantum-classical computation',
          complexity: 'O(N/P)',
          qubitsRequired: 'Task-dependent'
        },
        {
          name: 'Classical Computation',
          type: 'CLASSICAL',
          description: 'Traditional classical algorithms',
          complexity: 'Algorithm-dependent',
          qubitsRequired: 'None'
        }
      ];

      res.json({
        success: true,
        data: algorithms,
        total: algorithms.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Get performance metrics - calculated from existing processor data
  static async getPerformance(req, res) {
    try {
      const memoryUsage = processor.getMemoryUsage();
      const systemStatus = processor.getSystemStatus();
      const recentHistory = processor.getExecutionHistory(10);
      
      // Calculate performance metrics from execution history
      const totalExecutions = recentHistory.length;
      const avgExecutionTime = totalExecutions > 0 
        ? recentHistory.reduce((sum, exec) => sum + exec.executionTime, 0) / totalExecutions 
        : 0;
      
      const quantumOperations = recentHistory.reduce((sum, exec) => sum + (exec.quantumOperations || 0), 0);
      const classicalOperations = recentHistory.reduce((sum, exec) => sum + (exec.classicalOperations || 0), 0);
      
      const performance = {
        executionMetrics: {
          totalExecutions,
          averageExecutionTime: Math.round(avgExecutionTime),
          quantumOperations,
          classicalOperations,
          quantumToClassicalRatio: classicalOperations > 0 ? (quantumOperations / classicalOperations).toFixed(2) : 0
        },
        memoryPerformance: {
          quantumCoherence: memoryUsage.quantum.coherenceTime,
          cacheHitRate: memoryUsage.classical.cacheHitRate,
          memoryUtilization: (memoryUsage.classical.usedMemory / memoryUsage.classical.totalMemory) * 100
        },
        systemHealth: systemStatus.systemHealth,
        throughput: totalExecutions > 0 ? (totalExecutions / (avgExecutionTime / 1000)).toFixed(2) : 0
      };

      res.json({
        success: true,
        data: performance,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Execute quantum circuit - converted to use existing executeTask method
  static async executeCircuit(req, res) {
    try {
      const { circuit, parameters } = req.body;
      
      if (!circuit) {
        return res.status(400).json({
          success: false,
          error: 'Circuit is required'
        });
      }

      // Convert circuit to a task format that HybridProcessor can understand
      const task = {
        type: 'QUANTUM_SIMULATION',
        data: {
          system: circuit.system || { particles: circuit.qubits || 4 },
          timeSteps: circuit.steps || 10,
          gates: circuit.gates || [],
          parameters: parameters || {}
        },
        algorithm: 'quantum_circuit'
      };

      const result = await processor.executeTask(task);
      
      res.json({
        success: true,
        data: {
          circuitResult: result.result,
          quantumOperations: result.quantumOperations,
          executionTime: result.executionTime,
          finalState: result.result.finalState,
          entanglements: result.result.entanglements
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Get system metrics - comprehensive system information using existing methods
  static async getMetrics(req, res) {
    try {
      const systemStatus = processor.getSystemStatus();
      const memoryUsage = processor.getMemoryUsage();
      const recentHistory = processor.getExecutionHistory(20);
      
      // Calculate detailed metrics
      const metrics = {
        system: {
          status: systemStatus.isRunning ? 'active' : 'idle',
          health: systemStatus.systemHealth,
          uptime: systemStatus.isRunning ? 'Active' : 'Stopped',
          taskQueueLength: systemStatus.taskQueueLength,
          completedTasks: systemStatus.completedTasks
        },
        quantum: {
          qubits: memoryUsage.quantum.qubits,
          activeStates: memoryUsage.quantum.activeStates,
          entanglements: memoryUsage.quantum.entanglements,
          coherenceTime: memoryUsage.quantum.coherenceTime,
          coherenceRatio: (memoryUsage.quantum.coherenceTime / 10) * 100 // Assuming max coherence time of 10
        },
        classical: {
          totalMemory: memoryUsage.classical.totalMemory,
          usedMemory: memoryUsage.classical.usedMemory,
          memoryUtilization: ((memoryUsage.classical.usedMemory / memoryUsage.classical.totalMemory) * 100).toFixed(2),
          cacheHitRate: memoryUsage.classical.cacheHitRate.toFixed(2),
          performance: memoryUsage.classical.performance
        },
        execution: {
          recentTasks: recentHistory.length,
          successRate: recentHistory.length > 0 
            ? ((recentHistory.filter(task => !task.failed).length / recentHistory.length) * 100).toFixed(2)
            : 100,
          averageExecutionTime: recentHistory.length > 0
            ? Math.round(recentHistory.reduce((sum, task) => sum + task.executionTime, 0) / recentHistory.length)
            : 0,
          totalQuantumOps: recentHistory.reduce((sum, task) => sum + (task.quantumOperations || 0), 0),
          totalClassicalOps: recentHistory.reduce((sum, task) => sum + (task.classicalOperations || 0), 0)
        }
      };

      res.json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Execute a task
  static async executeTask(req, res) {
    try {
      const { task } = req.body;
      
      if (!task || !task.type) {
        return res.status(400).json({
          success: false,
          error: 'Task type is required'
        });
      }

      const result = await processor.executeTask(task);
      
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Start processor
  static async startProcessor(req, res) {
    try {
      await processor.startProcessing();
      res.json({
        success: true,
        message: 'Processor started successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Stop processor
  static async stopProcessor(req, res) {
    try {
      await processor.stopProcessing();
      res.json({
        success: true,
        message: 'Processor stopped successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get execution history
  static async getHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const history = processor.getExecutionHistory(limit);
      
      res.json({
        success: true,
        data: history,
        total: history.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Clear history
  static async clearHistory(req, res) {
    try {
      processor.clearHistory();
      res.json({
        success: true,
        message: 'History cleared successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Reset processor
  static async resetProcessor(req, res) {
    try {
      const config = req.body.config || {};
      processor = new HybridProcessor({
        qubits: config.qubits || 16,
        memorySize: config.memorySize || 2048,
        quantumThreshold: config.quantumThreshold || 0.1,
        hybridMode: config.hybridMode !== false
      });
      
      res.json({
        success: true,
        message: 'Processor reset successfully',
        config
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = ProcessorController;