const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Processor endpoints
  async getProcessorStatus() {
    return this.request('/processor/status');
  }

  async startProcessor(config = {}) {
    return this.request('/processor/start', {
      method: 'POST',
      body: config,
    });
  }

  async stopProcessor() {
    return this.request('/processor/stop', { method: 'POST' });
  }

  async resetProcessor() {
    return this.request('/processor/reset', { method: 'POST' });
  }

  async executeTask(task) {
    return this.request('/processor/execute', {
      method: 'POST',
      body: task,
    });
  }

  async getProcessorHistory() {
    return this.request('/processor/history');
  }

  async clearProcessorHistory() {
    return this.request('/processor/history', { method: 'DELETE' });
  }

  async getAlgorithms() {
    return this.request('/processor/algorithms');
  }

  async getPerformance() {
    return this.request('/processor/performance');
  }

  async executeCircuit(circuit) {
    return this.request('/processor/circuit', {
      method: 'POST',
      body: circuit,
    });
  }

  async getMetrics() {
    return this.request('/processor/metrics');
  }

  // Memory endpoints
  async getMemoryStatus() {
    return this.request('/memory/status');
  }

  async getQuantumState() {
    return this.request('/memory/quantum');
  }

  async quantumOperation(operation) {
    return this.request('/memory/quantum', {
      method: 'POST',
      body: operation,
    });
  }

  async classicalOperation(operation) {
    return this.request('/memory/classical', {
      method: 'POST',
      body: operation,
    });
  }

  async getAllQuantumStates() {
    return this.request('/memory/quantum/states');
  }

  async entangleQubits(qubit1, qubit2) {
    return this.request('/memory/quantum/entangle', {
      method: 'POST',
      body: { qubit1, qubit2 },
    });
  }

  async measureQubit(qubitId) {
    return this.request('/memory/quantum/measure', {
      method: 'POST',
      body: { qubitId },
    });
  }

  async getQuantumStats() {
    return this.request('/memory/quantum/stats');
  }

  async applyQuantumGate(gate) {
    return this.request('/memory/quantum/gate', {
      method: 'POST',
      body: gate,
    });
  }

  // Health check
  async healthCheck() {
    const url = this.baseURL.replace('/api', '') + '/health';
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Health check failed', error);
      throw error;
    }
  }
}
export default new ApiService();