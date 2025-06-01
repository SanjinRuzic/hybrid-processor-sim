// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://localhost:3001',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  };
  
  // Quantum Gates
  export const QUANTUM_GATES = {
    HADAMARD: { symbol: 'H', name: 'Hadamard', description: 'Creates superposition' },
    PAULI_X: { symbol: 'X', name: 'Pauli-X', description: 'Bit flip gate' },
    PAULI_Y: { symbol: 'Y', name: 'Pauli-Y', description: 'Bit and phase flip' },
    PAULI_Z: { symbol: 'Z', name: 'Pauli-Z', description: 'Phase flip gate' },
    ROTATION_X: { symbol: 'Rx', name: 'X-Rotation', description: 'Rotation around X-axis' },
    ROTATION_Y: { symbol: 'Ry', name: 'Y-Rotation', description: 'Rotation around Y-axis' },
    ROTATION_Z: { symbol: 'Rz', name: 'Z-Rotation', description: 'Rotation around Z-axis' },
    CNOT: { symbol: 'CNOT', name: 'Controlled-NOT', description: 'Two-qubit entangling gate' },
    CZ: { symbol: 'CZ', name: 'Controlled-Z', description: 'Controlled phase gate' },
    TOFFOLI: { symbol: 'TOF', name: 'Toffoli', description: 'Three-qubit gate' },
  };
  
  // Quantum Algorithms
  export const QUANTUM_ALGORITHMS = {
    SHOR: {
      id: 'shor',
      name: "Shor's Algorithm",
      description: 'Quantum factoring algorithm',
      complexity: 'O((log N)³)',
      category: 'Cryptography'
    },
    GROVER: {
      id: 'grover',
      name: "Grover's Algorithm",
      description: 'Quantum search algorithm',
      complexity: 'O(√N)',
      category: 'Search'
    },
    QFT: {
      id: 'qft',
      name: 'Quantum Fourier Transform',
      description: 'Quantum version of DFT',
      complexity: 'O((log N)²)',
      category: 'Transform'
    },
    VQE: {
      id: 'vqe',
      name: 'Variational Quantum Eigensolver',
      description: 'Hybrid quantum-classical optimization',
      complexity: 'O(N⁴)',
      category: 'Optimization'
    },
    QAOA: {
      id: 'qaoa',
      name: 'Quantum Approximate Optimization',
      description: 'Hybrid optimization algorithm',
      complexity: 'O(N²)',
      category: 'Optimization'
    }
  };
  
  // Color schemes
  export const COLORS = {
    // Quantum states
    QUBIT_0: '#3b82f6', // Blue
    QUBIT_1: '#ef4444', // Red
    SUPERPOSITION: '#8b5cf6', // Purple
    ENTANGLED: '#f59e0b', // Amber
    
    // Performance metrics
    SUCCESS: '#10b981', // Green
    WARNING: '#f59e0b', // Amber
    ERROR: '#ef4444', // Red
    INFO: '#3b82f6', // Blue
    
    // UI elements
    PRIMARY: '#6366f1', // Indigo
    SECONDARY: '#64748b', // Slate
    ACCENT: '#8b5cf6', // Purple
    BACKGROUND: '#f8fafc', // Very light gray
    SURFACE: '#ffffff', // White
    
    // Dark mode variants
    DARK: {
      BACKGROUND: '#0f172a', // Very dark blue
      SURFACE: '#1e293b', // Dark blue-gray
      TEXT: '#f1f5f9', // Light gray
      BORDER: '#334155', // Medium gray
    }
  };
  
  // Animation configurations
  export const ANIMATIONS = {
    FADE_IN: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 }
    },
    SLIDE_UP: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 }
    },
    SCALE_IN: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 }
    },
    PULSE: {
      animate: { 
        scale: [1, 1.05, 1],
        transition: { 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  };
  
  // Chart configurations
  export const CHART_CONFIG = {
    COLORS: {
      QUANTUM_OPS: '#8b5cf6',
      CLASSICAL_OPS: '#3b82f6',
      MEMORY_USAGE: '#10b981',
      COHERENCE: '#f59e0b',
      FIDELITY: '#ef4444',
      ENTANGLEMENT: '#6366f1'
    },
    ANIMATION: {
      DURATION: 750,
      EASING: 'easeInOutCubic'
    },
    GRID: {
      STROKE_DASHARRAY: '3 3',
      STROKE: '#e2e8f0'
    }
  };
  
  // Simulation parameters
  export const SIMULATION_CONFIG = {
    DEFAULT_QUBITS: 4,
    MAX_QUBITS: 16,
    DEFAULT_MEMORY_SIZE: 1024,
    MAX_MEMORY_SIZE: 8192,
    DEFAULT_STEP_INTERVAL: 100,
    MIN_STEP_INTERVAL: 10,
    MAX_STEP_INTERVAL: 5000,
    COHERENCE_TIME: 1000, // milliseconds
    DECOHERENCE_RATE: 0.001
  };
  
  // UI Constants
  export const UI_CONFIG = {
    SIDEBAR_WIDTH: 280,
    HEADER_HEIGHT: 64,
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024,
    DESKTOP_BREAKPOINT: 1280,
    MAX_CONTENT_WIDTH: 1400,
    CARD_BORDER_RADIUS: 8,
    BUTTON_BORDER_RADIUS: 6
  };
  
  // Performance thresholds
  export const PERFORMANCE_THRESHOLDS = {
    COHERENCE: {
      EXCELLENT: 0.9,
      GOOD: 0.7,
      FAIR: 0.5,
      POOR: 0.3
    },
    FIDELITY: {
      EXCELLENT: 0.95,
      GOOD: 0.85,
      FAIR: 0.7,
      POOR: 0.5
    },
    EXECUTION_TIME: {
      FAST: 100, // ms
      MEDIUM: 500,
      SLOW: 1000,
      VERY_SLOW: 5000
    }
  };
  
  // Error messages
  export const ERROR_MESSAGES = {
    CONNECTION_ERROR: 'Unable to connect to the simulation server',
    TIMEOUT_ERROR: 'Request timed out. Please check your connection',
    INVALID_INPUT: 'Invalid input parameters',
    SIMULATION_ERROR: 'Simulation execution failed',
    QUANTUM_ERROR: 'Quantum operation failed',
    MEMORY_ERROR: 'Memory operation failed',
    UNKNOWN_ERROR: 'An unexpected error occurred'
  };
  
  // Success messages
  export const SUCCESS_MESSAGES = {
    SIMULATION_STARTED: 'Simulation started successfully',
    SIMULATION_STOPPED: 'Simulation stopped',
    SIMULATION_RESET: 'Simulation reset successfully',
    TASK_EXECUTED: 'Task executed successfully',
    QUANTUM_GATE_APPLIED: 'Quantum gate applied',
    QUBITS_ENTANGLED: 'Qubits entangled successfully',
    QUBIT_MEASURED: 'Qubit measurement completed'
  };
  
  // Keyboard shortcuts
  export const KEYBOARD_SHORTCUTS = {
    START_SIMULATION: 'Space',
    STOP_SIMULATION: 'Escape',
    RESET_SIMULATION: 'r',
    TOGGLE_SIDEBAR: 's',
    REFRESH_DATA: 'f5',
    HELP: '?'
  };
  
  // Data visualization settings
  export const VISUALIZATION_CONFIG = {
    BLOCH_SPHERE: {
      RADIUS: 100,
      SEGMENTS: 32,
      OPACITY: 0.7,
      WIRE_OPACITY: 0.3
    },
    QUANTUM_CIRCUIT: {
      QUBIT_SPACING: 60,
      GATE_WIDTH: 40,
      GATE_HEIGHT: 30,
      WIRE_THICKNESS: 2
    },
    PERFORMANCE_CHART: {
      MAX_DATA_POINTS: 100,
      UPDATE_INTERVAL: 1000,
      SMOOTH_CURVE: true
    }
  };
  
  // Export all constants as default
  export default {
    API_CONFIG,
    QUANTUM_GATES,
    QUANTUM_ALGORITHMS,
    COLORS,
    ANIMATIONS,
    CHART_CONFIG,
    SIMULATION_CONFIG,
    UI_CONFIG,
    PERFORMANCE_THRESHOLDS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    KEYBOARD_SHORTCUTS,
    VISUALIZATION_CONFIG
  };