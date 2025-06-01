class QuantumMemory {
    constructor(qubits = 16) {
      this.qubits = qubits;
      this.quantumStates = new Array(qubits).fill(null).map(() => ({
        amplitude: { real: 1, imaginary: 0 },
        phase: 0,
        entangled: false,
        measurementHistory: []
      }));
      this.superpositionStates = new Map();
      this.entanglementPairs = [];
    }

    createSuperposition(qubitIndex, alpha = 0.707, beta = 0.707) {
      if (qubitIndex >= this.qubits) throw new Error('Qubit index out of range');
      
      this.quantumStates[qubitIndex] = {
        amplitude: { 
          real: alpha, 
          imaginary: beta 
        },
        phase: Math.atan2(beta, alpha),
        entangled: false,
        measurementHistory: []
      };
      
      this.superpositionStates.set(qubitIndex, { alpha, beta });
      return this.quantumStates[qubitIndex];
    }
  
    entangleQubits(qubit1, qubit2) {
      if (qubit1 >= this.qubits || qubit2 >= this.qubits) {
        throw new Error('Qubit indices out of range');
      }
  
      this.quantumStates[qubit1].entangled = true;
      this.quantumStates[qubit2].entangled = true;
      
      this.entanglementPairs.push([qubit1, qubit2]);
      return { qubit1, qubit2, entangled: true };
    }
  
    measureQubit(qubitIndex) {
      if (qubitIndex >= this.qubits) throw new Error('Qubit index out of range');
      
      const state = this.quantumStates[qubitIndex];
      const probability = Math.pow(state.amplitude.real, 2) + Math.pow(state.amplitude.imaginary, 2);
      const result = Math.random() < probability ? 1 : 0;
      
      state.amplitude = result === 1 ? { real: 1, imaginary: 0 } : { real: 0, imaginary: 1 };
      state.phase = 0;
      state.measurementHistory.push({ timestamp: Date.now(), result });
      
      this.handleEntanglementCollapse(qubitIndex, result);
      
      return result;
    }
  
    handleEntanglementCollapse(measuredQubit, result) {
      const entangledPair = this.entanglementPairs.find(pair => 
        pair.includes(measuredQubit)
      );
      
      if (entangledPair) {
        const partnerQubit = entangledPair.find(q => q !== measuredQubit);
        this.quantumStates[partnerQubit].amplitude = result === 1 ? 
          { real: 0, imaginary: 1 } : { real: 1, imaginary: 0 };
      }
    }

    applyGate(qubitIndex, gate) {
      if (qubitIndex >= this.qubits) throw new Error('Qubit index out of range');
      
      const state = this.quantumStates[qubitIndex];
      
      switch (gate.type) {
        case 'HADAMARD':
          state.amplitude = { real: 0.707, imaginary: 0.707 };
          state.phase = Math.PI / 4;
          break;
        case 'PAULI_X':
          [state.amplitude.real, state.amplitude.imaginary] = 
          [state.amplitude.imaginary, state.amplitude.real];
          break;
        case 'PAULI_Z':
          state.amplitude.imaginary *= -1;
          state.phase += Math.PI;
          break;
        case 'ROTATION':
          const angle = gate.angle || Math.PI / 4;
          const cos = Math.cos(angle / 2);
          const sin = Math.sin(angle / 2);
          const newReal = cos * state.amplitude.real - sin * state.amplitude.imaginary;
          const newImag = sin * state.amplitude.real + cos * state.amplitude.imaginary;
          state.amplitude = { real: newReal, imaginary: newImag };
          state.phase = Math.atan2(newImag, newReal);
          break;
      }
      
      return state;
    }
  
    getQuantumState() {
      return {
        qubits: this.qubits,
        states: this.quantumStates,
        superpositions: Array.from(this.superpositionStates.entries()),
        entanglements: this.entanglementPairs,
        coherenceTime: this.calculateCoherenceTime()
      };
    }
  
    calculateCoherenceTime() {
      const activeQubits = this.quantumStates.filter(state => 
        state.amplitude.real !== 1 && state.amplitude.real !== 0
      );
      return Math.max(1, 10 - activeQubits.length * 0.5); // Seconds
    }
  }
  
  module.exports = QuantumMemory;