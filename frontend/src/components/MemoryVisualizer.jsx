import React from 'react';
import { MemoryStick, HardDrive, Zap, Database } from 'lucide-react';

const MemoryVisualizer = ({ memoryState }) => {
  const { classical, quantum } = memoryState;

  const formatBytes = (bytes) => {
    return `${bytes.toFixed(1)}GB`;
  };

  const getUsageColor = (percentage) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCacheColor = (level) => {
    const colors = {
      l1: 'bg-blue-500',
      l2: 'bg-purple-500',
      l3: 'bg-orange-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Database className="h-5 w-5 text-green-400" />
          Memory Systems
        </h2>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <span>Real-time monitoring</span>
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
        </div>
      </div>

      {/* Classical Memory Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MemoryStick className="h-4 w-4 text-blue-400" />
            Classical Memory
          </h3>
          <div className="text-sm text-slate-400">
            {formatBytes(classical.used)} / {formatBytes(classical.total)} used
          </div>
        </div>

        {/* Main Memory Usage */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">System RAM</span>
            <span className="text-sm text-slate-400">
              {((classical.used / classical.total) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="bg-slate-600 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getUsageColor((classical.used / classical.total) * 100)}`}
              style={{ width: `${(classical.used / classical.total) * 100}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>0GB</span>
            <span>{formatBytes(classical.total)}</span>
          </div>
        </div>

        {/* Cache Hierarchy */}
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(classical.cache).map(([level, usage]) => (
            <div key={level} className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase">{level} Cache</span>
                <span className="text-xs text-slate-400">{usage}%</span>
              </div>
              <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${getCacheColor(level)}`}
                  style={{ width: `${usage}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {level === 'l1' && '32KB'}
                {level === 'l2' && '256KB'}
                {level === 'l3' && '8MB'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quantum Memory Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-400" />
            Quantum Memory
          </h3>
          <div className="text-sm text-slate-400">
            {quantum.qubits} qubits available
          </div>
        </div>

        {/* Quantum Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Coherence Time</span>
              <span className="text-sm text-purple-400">{quantum.coherenceTime}μs</span>
            </div>
            <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${(quantum.coherenceTime / 150) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Fidelity</span>
              <span className="text-sm text-green-400">{quantum.fidelity.toFixed(1)}%</span>
            </div>
            <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${quantum.fidelity}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Qubit Utilization */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Qubit Utilization</span>
            <span className="text-sm text-slate-400">
              {quantum.entangled}/{quantum.qubits} entangled
            </span>
          </div>
          
          {/* Qubit Grid Visualization */}
          <div className="grid grid-cols-8 gap-1 mb-3">
            {Array.from({ length: quantum.qubits }, (_, i) => (
              <div
                key={i}
                className={`h-6 w-6 rounded border-2 transition-all duration-300 ${
                  i < quantum.entangled
                    ? 'bg-purple-500/30 border-purple-400 animate-pulse'
                    : 'bg-slate-600/30 border-slate-500'
                }`}
                title={`Qubit ${i}: ${i < quantum.entangled ? 'Entangled' : 'Free'}`}
              ></div>
            ))}
          </div>

          <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(quantum.entangled / quantum.qubits) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Quantum State Quality Indicators */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Decoherence</div>
            <div className="text-lg font-bold text-yellow-400">
              {(100 - quantum.coherenceTime * 0.67).toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Error Rate</div>
            <div className="text-lg font-bold text-red-400">
              {(100 - quantum.fidelity).toFixed(2)}%
            </div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Efficiency</div>
            <div className="text-lg font-bold text-green-400">
              {((quantum.entangled / quantum.qubits) * quantum.fidelity).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryVisualizer;