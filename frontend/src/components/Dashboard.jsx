import React, { useState, useEffect } from 'react';
import { Activity, Cpu, MemoryStick, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import ProcessorControls from './ProcessorControls';
import MemoryVisualizer from './MemoryVisualizer';
import QuantumStateDisplay from './QuantumStateDisplay';
import PerformanceMetrics from './PerformanceMetrics';

const Dashboard = () => {
  const [processorState, setProcessorState] = useState({
    isRunning: false,
    mode: 'hybrid',
    frequency: 2.4,
    temperature: 45,
    power: 85
  });

  const [memoryState, setMemoryState] = useState({
    classical: {
      used: 4.2,
      total: 16,
      cache: {
        l1: 85,
        l2: 72,
        l3: 45
      }
    },
    quantum: {
      qubits: 64,
      coherenceTime: 100,
      fidelity: 99.2,
      entangled: 32
    }
  });

  const [quantumState, setQuantumState] = useState({
    qubits: Array.from({ length: 8 }, (_, i) => ({
      id: i,
      state: Math.random() > 0.5 ? '|1⟩' : '|0⟩',
      probability: Math.random(),
      phase: Math.random() * 2 * Math.PI
    })),
    entanglement: [
      { qubit1: 0, qubit2: 1, strength: 0.85 },
      { qubit1: 2, qubit2: 3, strength: 0.92 },
      { qubit1: 4, qubit2: 5, strength: 0.78 }
    ]
  });

  const [performanceData, setPerformanceData] = useState({
    metrics: [
      { name: 'CPU Usage', value: 68, trend: 'up', color: 'blue' },
      { name: 'Memory Usage', value: 42, trend: 'stable', color: 'green' },
      { name: 'Quantum Coherence', value: 94, trend: 'down', color: 'purple' },
      { name: 'Hybrid Efficiency', value: 87, trend: 'up', color: 'orange' }
    ],
    history: Array.from({ length: 20 }, (_, i) => ({
      time: Date.now() - (19 - i) * 1000,
      classical: 60 + Math.random() * 20,
      quantum: 80 + Math.random() * 15,
      hybrid: 75 + Math.random() * 20
    }))
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update processor metrics
      setProcessorState(prev => ({
        ...prev,
        temperature: 45 + Math.random() * 10,
        power: 80 + Math.random() * 15
      }));

      // Update memory usage
      setMemoryState(prev => ({
        ...prev,
        classical: {
          ...prev.classical,
          used: 3 + Math.random() * 2,
          cache: {
            l1: 80 + Math.random() * 15,
            l2: 65 + Math.random() * 20,
            l3: 40 + Math.random() * 15
          }
        },
        quantum: {
          ...prev.quantum,
          coherenceTime: 95 + Math.random() * 10,
          fidelity: 98.5 + Math.random() * 1
        }
      }));

      // Update quantum states
      setQuantumState(prev => ({
        ...prev,
        qubits: prev.qubits.map(qubit => ({
          ...qubit,
          probability: Math.random(),
          phase: Math.random() * 2 * Math.PI
        }))
      }));

      // Update performance metrics
      setPerformanceData(prev => ({
        ...prev,
        metrics: prev.metrics.map(metric => ({
          ...metric,
          value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 5))
        })),
        history: [
          ...prev.history.slice(1),
          {
            time: Date.now(),
            classical: 60 + Math.random() * 20,
            quantum: 80 + Math.random() * 15,
            hybrid: 75 + Math.random() * 20
          }
        ]
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleProcessorControl = (action, value) => {
    switch (action) {
      case 'start':
        setProcessorState(prev => ({ ...prev, isRunning: true }));
        break;
      case 'stop':
        setProcessorState(prev => ({ ...prev, isRunning: false }));
        break;
      case 'setMode':
        setProcessorState(prev => ({ ...prev, mode: value }));
        break;
      case 'setFrequency':
        setProcessorState(prev => ({ ...prev, frequency: value }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Hybrid Quantum-Classical Processor</h1>
                <p className="text-slate-400">Real-time simulation dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${processorState.isRunning ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                <span className="text-sm font-medium">
                  {processorState.isRunning ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">System Time</div>
                <div className="font-mono text-sm">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Processor Mode</p>
                <p className="text-2xl font-bold capitalize">{processorState.mode}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Frequency</p>
                <p className="text-2xl font-bold">{processorState.frequency}GHz</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Temperature</p>
                <p className="text-2xl font-bold">{processorState.temperature.toFixed(1)}°C</p>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                processorState.temperature > 50 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}>
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Power Draw</p>
                <p className="text-2xl font-bold">{processorState.power.toFixed(0)}W</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ProcessorControls 
              processorState={processorState}
              onControl={handleProcessorControl}
            />
            <MemoryVisualizer memoryState={memoryState} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <QuantumStateDisplay quantumState={quantumState} />
            <PerformanceMetrics performanceData={performanceData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;