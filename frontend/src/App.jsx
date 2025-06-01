import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProcessorControls from './components/ProcessorControls';
import MemoryVisualizer from './components/MemoryVisualizer';
import QuantumStateDisplay from './components/QuantumStateDisplay';
import PerformanceMetrics from './components/PerformanceMetrics';

function App() {
  return (
    <Router>
      <div className="App p-6">
        <h1 className="text-2xl font-bold mb-4">Hybrid Processor Simulator</h1>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/processor-controls" element={<ProcessorControls />} />
          <Route path="/memory-visualizer" element={<MemoryVisualizer />} />
          <Route path="/quantum-state" element={<QuantumStateDisplay />} />
          <Route path="/performance-metrics" element={<PerformanceMetrics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
