import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Zap, Waves, Info, AlertTriangle } from 'lucide-react';

const QuantumStateDisplay = ({ quantumData, isConnected = true }) => {
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Mock data structure if no data provided
  const defaultData = {
    qubits: Array.from({ length: 8 }, (_, i) => ({
      id: i,
      amplitude: Math.random() * 0.8 + 0.2,
      phase: Math.random() * 2 * Math.PI,
      coherence: Math.random() * 0.9 + 0.1,
      entangled: Math.random() > 0.7,
      state: Math.random() > 0.5 ? '|1⟩' : '|0⟩'
    })),
    entanglementPairs: [
      [0, 3], [1, 5], [2, 7], [4, 6]
    ],
    coherenceTime: 150 + Math.random() * 100,
    fidelity: 0.92 + Math.random() * 0.07,
    gateCount: Math.floor(Math.random() * 1000) + 500,
    temperature: 0.01 + Math.random() * 0.005
  };

  const data = quantumData || defaultData;

  // Animation for quantum state visualization
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 0.1) % (2 * Math.PI));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Calculate bloch sphere position for qubit
  const getBlochPosition = (qubit) => {
    const theta = qubit.phase + animationPhase * 0.5;
    const phi = qubit.amplitude * Math.PI;
    return {
      x: Math.sin(phi) * Math.cos(theta) * 40,
      y: Math.sin(phi) * Math.sin(theta) * 40,
      z: Math.cos(phi) * 40
    };
  };

  const QubitVisualization = ({ qubit, index, isSelected }) => {
    const position = getBlochPosition(qubit);
    const coherenceColor = qubit.coherence > 0.8 ? 'from-green-400 to-emerald-500' :
                          qubit.coherence > 0.5 ? 'from-yellow-400 to-orange-500' :
                          'from-red-400 to-pink-500';

    return (
      <div
        className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
          isSelected 
            ? 'border-blue-400 bg-blue-50 shadow-lg shadow-blue-200' 
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }`}
        onClick={() => setSelectedQubit(index)}
      >
        {/* Qubit Label */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Q{index}</span>
          {qubit.entangled && (
            <div className="flex items-center text-xs text-purple-600">
              <Zap size={12} className="mr-1" />
              Entangled
            </div>
          )}
        </div>

        {/* Bloch Sphere Representation */}
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="absolute inset-0 rounded-full border border-gray-300 bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Quantum state point */}
            <div
              className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${coherenceColor} shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100`}
              style={{
                left: `${50 + position.x}%`,
                top: `${50 - position.y}%`,
                opacity: qubit.coherence
              }}
            />
            {/* State vector line */}
            <svg className="absolute inset-0 w-full h-full">
              <line
                x1="50%"
                y1="50%"
                x2={`${50 + position.x}%`}
                y2={`${50 - position.y}%`}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-400"
                opacity={qubit.coherence * 0.7}
              />
            </svg>
          </div>
        </div>

        {/* State Information */}
        <div className="text-center space-y-1">
          <div className="text-sm font-mono text-gray-800">{qubit.state}</div>
          <div className="text-xs text-gray-500">
            C: {qubit.coherence.toFixed(3)}
          </div>
        </div>

        {/* Coherence bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
          <div
            className={`h-1 rounded-full bg-gradient-to-r ${coherenceColor} transition-all duration-300`}
            style={{ width: `${qubit.coherence * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const EntanglementVisualization = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Waves className="text-purple-500 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Entanglement Network</h3>
      </div>
      
      <div className="relative h-48">
        <svg className="w-full h-full">
          {/* Draw entanglement connections */}
          {data.entanglementPairs.map((pair, index) => {
            const [q1, q2] = pair;
            const angle1 = (q1 / data.qubits.length) * 2 * Math.PI;
            const angle2 = (q2 / data.qubits.length) * 2 * Math.PI;
            const radius = 80;
            const centerX = 150;
            const centerY = 96;
            
            const x1 = centerX + Math.cos(angle1) * radius;
            const y1 = centerY + Math.sin(angle1) * radius;
            const x2 = centerX + Math.cos(angle2) * radius;
            const y2 = centerY + Math.sin(angle2) * radius;

            return (
              <g key={index}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgb(147, 51, 234)"
                  strokeWidth="2"
                  opacity="0.6"
                  className="animate-pulse"
                />
              </g>
            );
          })}
          
          {/* Draw qubit nodes */}
          {data.qubits.map((qubit, index) => {
            const angle = (index / data.qubits.length) * 2 * Math.PI;
            const radius = 80;
            const x = 150 + Math.cos(angle) * radius;
            const y = 96 + Math.sin(angle) * radius;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={qubit.entangled ? "rgb(147, 51, 234)" : "rgb(107, 114, 128)"}
                  className="transition-colors duration-300"
                />
                <text
                  x={x}
                  y={y + 2}
                  textAnchor="middle"
                  className="text-xs fill-white font-semibold"
                >
                  {index}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center">
          <Activity className="text-blue-500 mr-3" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Quantum State Monitor</h2>
            <p className="text-sm text-gray-600">Real-time quantum system visualization</p>
          </div>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
          isConnected 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Fidelity</span>
            <Info size={14} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {(data.fidelity * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Coherence Time</span>
            <Info size={14} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {data.coherenceTime.toFixed(0)}μs
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Gate Operations</span>
            <Info size={14} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {data.gateCount.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Temperature</span>
            {data.temperature > 0.015 && <AlertTriangle size={14} className="text-orange-500" />}
          </div>
          <div className="text-2xl font-bold text-orange-600 mt-1">
            {(data.temperature * 1000).toFixed(1)}mK
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Qubit Grid */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Qubit States</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {data.qubits.map((qubit, index) => (
                <QubitVisualization
                  key={index}
                  qubit={qubit}
                  index={index}
                  isSelected={selectedQubit === index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Selected Qubit Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Qubit {selectedQubit} Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">State:</span>
                <span className="font-mono font-semibold">{data.qubits[selectedQubit].state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amplitude:</span>
                <span className="font-mono">{data.qubits[selectedQubit].amplitude.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phase:</span>
                <span className="font-mono">{data.qubits[selectedQubit].phase.toFixed(4)} rad</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Coherence:</span>
                <span className="font-mono">{data.qubits[selectedQubit].coherence.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entangled:</span>
                <span className={`font-semibold ${
                  data.qubits[selectedQubit].entangled ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {data.qubits[selectedQubit].entangled ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <EntanglementVisualization />
        </div>
      </div>
    </div>
  );
};

export default QuantumStateDisplay;