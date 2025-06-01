import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/api';

export const useSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [processorStatus, setProcessorStatus] = useState(null);
  const [memoryStatus, setMemoryStatus] = useState(null);
  const [quantumStates, setQuantumStates] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [algorithms, setAlgorithms] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const pollingInterval = useRef(null);
  const updateInterval = 1000; // 1 second

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Polling function to get real-time updates
  const pollData = useCallback(async () => {
    try {
      const [
        processorStatusData,
        memoryStatusData,
        quantumStatesData,
        performanceData,
        metricsData
      ] = await Promise.allSettled([
        apiService.getProcessorStatus(),
        apiService.getMemoryStatus(),
        apiService.getAllQuantumStates(),
        apiService.getPerformance(),
        apiService.getMetrics()
      ]);

      if (processorStatusData.status === 'fulfilled') {
        setProcessorStatus(processorStatusData.value);
        setIsRunning(processorStatusData.value.isRunning || false);
      }

      if (memoryStatusData.status === 'fulfilled') {
        setMemoryStatus(memoryStatusData.value);
      }

      if (quantumStatesData.status === 'fulfilled') {
        setQuantumStates(quantumStatesData.value || []);
      }

      if (performanceData.status === 'fulfilled') {
        setPerformance(performanceData.value);
      }

      if (metricsData.status === 'fulfilled') {
        setMetrics(metricsData.value);
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  }, []);

  // Start polling when simulation is running
  useEffect(() => {
    if (isRunning) {
      pollingInterval.current = setInterval(pollData, updateInterval);
    } else {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [isRunning, pollData]);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [algorithmsData, historyData] = await Promise.allSettled([
          apiService.getAlgorithms(),
          apiService.getProcessorHistory()
        ]);

        if (algorithmsData.status === 'fulfilled') {
          setAlgorithms(algorithmsData.value || []);
        }

        if (historyData.status === 'fulfilled') {
          setHistory(historyData.value || []);
        }

        // Initial status check
        await pollData();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [pollData]);

  // Control functions
  const startSimulation = useCallback(async (config = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.startProcessor(config);
      if (result.success) {
        setIsRunning(true);
        // Refresh history after starting
        const historyData = await apiService.getProcessorHistory();
        setHistory(historyData || []);
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const stopSimulation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.stopProcessor();
      if (result.success) {
        setIsRunning(false);
        // Final data refresh
        await pollData();
        const historyData = await apiService.getProcessorHistory();
        setHistory(historyData || []);
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pollData]);

  const resetSimulation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.resetProcessor();
      if (result.success) {
        setIsRunning(false);
        setQuantumStates([]);
        setPerformance(null);
        setMetrics(null);
        setHistory([]);
        // Refresh all data
        await pollData();
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pollData]);

  const executeTask = useCallback(async (task) => {
    try {
      setError(null);
      const result = await apiService.executeTask(task);
      // Refresh data after execution
      await pollData();
      const historyData = await apiService.getProcessorHistory();
      setHistory(historyData || []);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [pollData]);

  const executeCircuit = useCallback(async (circuit) => {
    try {
      setError(null);
      const result = await apiService.executeCircuit(circuit);
      // Refresh quantum states after circuit execution
      const quantumStatesData = await apiService.getAllQuantumStates();
      setQuantumStates(quantumStatesData || []);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const applyQuantumGate = useCallback(async (gate) => {
    try {
      setError(null);
      const result = await apiService.applyQuantumGate(gate);
      // Refresh quantum states
      const quantumStatesData = await apiService.getAllQuantumStates();
      setQuantumStates(quantumStatesData || []);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const entangleQubits = useCallback(async (qubit1, qubit2) => {
    try {
      setError(null);
      const result = await apiService.entangleQubits(qubit1, qubit2);
      // Refresh quantum states
      const quantumStatesData = await apiService.getAllQuantumStates();
      setQuantumStates(quantumStatesData || []);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const measureQubit = useCallback(async (qubitId) => {
    try {
      setError(null);
      const result = await apiService.measureQubit(qubitId);
      // Refresh quantum states
      const quantumStatesData = await apiService.getAllQuantumStates();
      setQuantumStates(quantumStatesData || []);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      setError(null);
      await apiService.clearProcessorHistory();
      setHistory([]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const refreshData = useCallback(async () => {
    await pollData();
    const historyData = await apiService.getProcessorHistory();
    setHistory(historyData || []);
  }, [pollData]);

  return {
    // State
    isRunning,
    processorStatus,
    memoryStatus,
    quantumStates,
    performance,
    metrics,
    algorithms,
    history,
    error,
    loading,
    
    // Actions
    startSimulation,
    stopSimulation,
    resetSimulation,
    executeTask,
    executeCircuit,
    applyQuantumGate,
    entangleQubits,
    measureQubit,
    clearHistory,
    refreshData,
    
    // Utilities
    setError
  };
};