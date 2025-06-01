import React from 'react';
import { Play, Pause, Square, Settings, Cpu, Zap, Thermometer } from 'lucide-react';

const ProcessorControls = ({ processorState, onControl }) => {
  const modes = [
    { value: 'classical', label: 'Classical Only', color: 'blue' },
    { value: 'quantum', label: 'Quantum Only', color: 'purple' },
    { value: 'hybrid', label: 'Hybrid Mode', color: 'green' }
  ];

  const frequencies = [1.2, 1.8, 2.4, 3.0, 3.6, 4.2];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-400" />
          Processor Controls
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            processorState.isRunning 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {processorState.isRunning ? 'RUNNING' : 'STOPPED'}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => onControl('start')}
          disabled={processorState.isRunning}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:text-slate-400 rounded-lg transition-colors font-medium"
        >
          <Play className="h-4 w-4" />
          Start
        </button>
        
        <button
          onClick={() => onControl('pause')}
          disabled={!processorState.isRunning}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-600 disabled:text-slate-400 rounded-lg transition-colors font-medium"
        >
          <Pause className="h-4 w-4" />
          Pause
        </button>
        
        <button
          onClick={() => onControl('stop')}
          disabled={!processorState.isRunning}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:text-slate-400 rounded-lg transition-colors font-medium"
        >
          <Square className="h-4 w-4" />
          Stop
        </button>
      </div>

      {/* Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Processing Mode
        </label>
        <div className="grid grid-cols-1 gap-2">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onControl('setMode', mode.value)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                processorState.mode === mode.value
                  ? `border-${mode.color}-500 bg-${mode.color}-500/10 text-${mode.color}-400`
                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  processorState.mode === mode.value
                    ? `bg-${mode.color}-500/20`
                    : 'bg-slate-600/50'
                }`}>
                  <Cpu className="h-4 w-4" />
                </div>
                <span className="font-medium">{mode.label}</span>
              </div>
              {processorState.mode === mode.value && (
                <div className={`h-2 w-2 rounded-full bg-${mode.color}-400`}></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency Control */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Clock Frequency: {processorState.frequency}GHz
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="1.2"
            max="4.2"
            step="0.6"
            value={processorState.frequency}
            onChange={(e) => onControl('setFrequency', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-400">
            {frequencies.map((freq) => (
              <span key={freq}>{freq}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Temperature</span>
            <Thermometer className="h-4 w-4 text-orange-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{processorState.temperature?.toFixed(1)}°C</span>
            <div className={`px-2 py-1 rounded text-xs ${
              processorState.temperature > 50 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-green-500/20 text-green-400'
            }`}>
              {processorState.temperature > 50 ? 'WARM' : 'NORMAL'}
            </div>
          </div>
          <div className="mt-2 bg-slate-600 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                processorState.temperature > 50 ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, (processorState.temperature / 80) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Power Draw</span>
            <Zap className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{processorState.power?.toFixed(0)}W</span>
            <div className={`px-2 py-1 rounded text-xs ${
              processorState.power > 90 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-green-500/20 text-green-400'
            }`}>
              {processorState.power > 90 ? 'HIGH' : 'NORMAL'}
            </div>
          </div>
          <div className="mt-2 bg-slate-600 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                processorState.power > 90 ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${(processorState.power / 120) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e293b;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e293b;
        }
      `}</style>
    </div>
  );
};

export default ProcessorControls;