class QuantumService {
    constructor() {
      this.quantumStates = new Map();
      this.entanglementPairs = new Map();
      this.coherenceTime = 1000; // milliseconds
    }
  
    // Create a new qubit with initial state
    createQubit(id, alpha = 1, beta = 0) {
      const qubit = {
        id,
        alpha: { real: alpha, imaginary: 0 },
        beta: { real: beta, imaginary: 0 },
        coherenceTime: this.coherenceTime,
        lastUpdate: Date.now(),
        isEntangled: false,
        entangledWith: null
      };
      
      this.quantumStates.set(id, qubit);
      return qubit;
    }
  
    // Apply Hadamard gate (creates superposition)
    hadamardGate(qubitId) {
      const qubit = this.quantumStates.get(qubitId);
      if (!qubit) throw new Error(`Qubit ${qubitId} not found`);
  
      const sqrt2 = Math.sqrt(2);
      const newAlpha = {
        real: (qubit.alpha.real + qubit.beta.real) / sqrt2,
        imaginary: (qubit.alpha.imaginary + qubit.beta.imaginary) / sqrt2
      };
      const newBeta = {
        real: (qubit.alpha.real - qubit.beta.real) / sqrt2,
        imaginary: (qubit.alpha.imaginary - qubit.beta.imaginary) / sqrt2
      };
  
      qubit.alpha = newAlpha;
      qubit.beta = newBeta;
      qubit.lastUpdate = Date.now();
  
      return this.normalizeQubit(qubit);
    }
  
    // Apply Pauli-X gate (bit flip)
    xGate(qubitId) {
      const qubit = this.quantumStates.get(qubitId);
      if (!qubit) throw new Error(`Qubit ${qubitId} not found`);
  
      const temp = { ...qubit.alpha };
      qubit.alpha = { ...qubit.beta };
      qubit.beta = temp;
      qubit.lastUpdate = Date.now();
  
      return qubit;
    }
  
    // Apply Pauli-Z gate (phase flip)
    zGate(qubitId) {
      const qubit = this.quantumStates.get(qubitId);
      if (!qubit) throw new Error(`Qubit ${qubitId} not found`);
  
      qubit.beta.real = -qubit.beta.real;
      qubit.beta.imaginary = -qubit.beta.imaginary;
      qubit.lastUpdate = Date.now();
  
      return qubit;
    }
  
    // Create entanglement between two qubits
    entangle(qubitId1, qubitId2) {
      const qubit1 = this.quantumStates.get(qubitId1);
      const qubit2 = this.quantumStates.get(qubitId2);
      
      if (!qubit1 || !qubit2) {
        throw new Error('One or both qubits not found');
      }
  
      // Create Bell state |00⟩ + |11⟩
      qubit1.alpha = { real: Math.sqrt(0.5), imaginary: 0 };
      qubit1.beta = { real: 0, imaginary: 0 };
      qubit2.alpha = { real: 0, imaginary: 0 };
      qubit2.beta = { real: Math.sqrt(0.5), imaginary: 0 };
  
      qubit1.isEntangled = true;
      qubit2.isEntangled = true;
      qubit1.entangledWith = qubitId2;
      qubit2.entangledWith = qubitId1;
  
      const pairId = `${qubitId1}-${qubitId2}`;
      this.entanglementPairs.set(pairId, {
        qubit1: qubitId1,
        qubit2: qubitId2,
        createdAt: Date.now()
      });
  
      return { qubit1, qubit2, pairId };
    }
  
    // Measure a qubit (collapses superposition)
    measure(qubitId) {
      const qubit = this.quantumStates.get(qubitId);
      if (!qubit) throw new Error(`Qubit ${qubitId} not found`);
  
      // Calculate probabilities
      const prob0 = qubit.alpha.real ** 2 + qubit.alpha.imaginary ** 2;
      const prob1 = qubit.beta.real ** 2 + qubit.beta.imaginary ** 2;
  
      // Simulate measurement with random collapse
      const measurement = Math.random() < prob0 ? 0 : 1;
  
      // Collapse the state
      if (measurement === 0) {
        qubit.alpha = { real: 1, imaginary: 0 };
        qubit.beta = { real: 0, imaginary: 0 };
      } else {
        qubit.alpha = { real: 0, imaginary: 0 };
        qubit.beta = { real: 1, imaginary: 0 };
      }
  
      // Handle entangled qubits
      if (qubit.isEntangled && qubit.entangledWith) {
        const entangledQubit = this.quantumStates.get(qubit.entangledWith);
        if (entangledQubit) {
          // Correlated measurement for Bell state
          if (measurement === 0) {
            entangledQubit.alpha = { real: 1, imaginary: 0 };
            entangledQubit.beta = { real: 0, imaginary: 0 };
          } else {
            entangledQubit.alpha = { real: 0, imaginary: 0 };
            entangledQubit.beta = { real: 1, imaginary: 0 };
          }
        }
      }
  
      qubit.lastUpdate = Date.now();
      return { measurement, probabilities: { prob0, prob1 } };
    }
  
    // Apply decoherence over time
    applyDecoherence(qubitId, factor = 0.01) {
      const qubit = this.quantumStates.get(qubitId);
      if (!qubit) return null;
  
      const timeDelta = Date.now() - qubit.lastUpdate;
      const decayFactor = Math.exp(-timeDelta * factor / 1000);
  
      // Reduce coherence of superposition states
      if (qubit.alpha.real !== 0 && qubit.beta.real !== 0) {
        qubit.alpha.real *= decayFactor;
        qubit.alpha.imaginary *= decayFactor;
        qubit.beta.real *= decayFactor;
        qubit.beta.imaginary *= decayFactor;
      }
  
      return this.normalizeQubit(qubit);
    }
  
    // Normalize qubit amplitudes
    normalizeQubit(qubit) {
      const norm = Math.sqrt(
        qubit.alpha.real ** 2 + qubit.alpha.imaginary ** 2 +
        qubit.beta.real ** 2 + qubit.beta.imaginary ** 2
      );
  
      if (norm > 0) {
        qubit.alpha.real /= norm;
        qubit.alpha.imaginary /= norm;
        qubit.beta.real /= norm;
        qubit.beta.imaginary /= norm;
      }
  
      return qubit;
    }
  
    // Get quantum state visualization data
    getStateVisualization(qubitId) {
      const qubit = this.quantumStates.get(qubitId);
      if (!qubit) return null;
  
      const prob0 = qubit.alpha.real ** 2 + qubit.alpha.imaginary ** 2;
      const prob1 = qubit.beta.real ** 2 + qubit.beta.imaginary ** 2;
  
      return {
        id: qubitId,
        amplitudes: {
          alpha: qubit.alpha,
          beta: qubit.beta
        },
        probabilities: { prob0, prob1 },
        isEntangled: qubit.isEntangled,
        entangledWith: qubit.entangledWith,
        coherenceTime: Date.now() - qubit.lastUpdate,
        blochSphere: this.calculateBlochCoordinates(qubit)
      };
    }
  
    // Calculate Bloch sphere coordinates for visualization
    calculateBlochCoordinates(qubit) {
      const { alpha, beta } = qubit;
      
      // Extract phase information
      const phase = Math.atan2(beta.imaginary, beta.real) - Math.atan2(alpha.imaginary, alpha.real);
      const theta = 2 * Math.acos(Math.abs(alpha.real));
      
      return {
        x: Math.sin(theta) * Math.cos(phase),
        y: Math.sin(theta) * Math.sin(phase),
        z: Math.cos(theta)
      };
    }
  
    // Quantum Fourier Transform simulation
    quantumFourierTransform(qubitIds) {
      const results = [];
      
      for (let i = 0; i < qubitIds.length; i++) {
        const qubitId = qubitIds[i];
        this.hadamardGate(qubitId);
        
        // Apply controlled phase gates
        for (let j = i + 1; j < qubitIds.length; j++) {
          this.controlledPhaseGate(qubitIds[j], qubitId, Math.PI / Math.pow(2, j - i));
        }
        
        results.push(this.getStateVisualization(qubitId));
      }
      
      return results;
    }
  
    // Controlled phase gate
    controlledPhaseGate(controlId, targetId, phase) {
      const control = this.quantumStates.get(controlId);
      const target = this.quantumStates.get(targetId);
      
      if (!control || !target) return null;
  
      // Apply phase only if control qubit is in |1⟩ state
      if (control.beta.real !== 0 || control.beta.imaginary !== 0) {
        target.beta.real = target.beta.real * Math.cos(phase) - target.beta.imaginary * Math.sin(phase);
        target.beta.imaginary = target.beta.real * Math.sin(phase) + target.beta.imaginary * Math.cos(phase);
      }
  
      return target;
    }
  
    // Get all quantum states
    getAllStates() {
      const states = [];
      for (const [id, qubit] of this.quantumStates) {
        states.push(this.getStateVisualization(id));
      }
      return states;
    }
  
    // Reset quantum system
    reset() {
      this.quantumStates.clear();
      this.entanglementPairs.clear();
    }
  
    // Get system statistics
    getSystemStats() {
      return {
        totalQubits: this.quantumStates.size,
        entangledPairs: this.entanglementPairs.size,
        averageCoherence: this.calculateAverageCoherence(),
        systemFidelity: this.calculateSystemFidelity()
      };
    }
  
    calculateAverageCoherence() {
      let totalCoherence = 0;
      for (const qubit of this.quantumStates.values()) {
        const timeDelta = Date.now() - qubit.lastUpdate;
        totalCoherence += Math.exp(-timeDelta / qubit.coherenceTime);
      }
      return this.quantumStates.size > 0 ? totalCoherence / this.quantumStates.size : 0;
    }
  
    calculateSystemFidelity() {
      let fidelity = 1;
      for (const qubit of this.quantumStates.values()) {
        const timeDelta = Date.now() - qubit.lastUpdate;
        fidelity *= Math.exp(-timeDelta / (qubit.coherenceTime * 10));
      }
      return fidelity;
    }
  }
  
  module.exports = new QuantumService();