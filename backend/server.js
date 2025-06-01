const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const processorRoutes = require('./src/routes/processor');
const memoryRoutes = require('./src/routes/memory');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/processor', processorRoutes);
app.use('/api/memory', memoryRoutes);

// API overview endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Hybrid Processor Simulator API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      processor: {
        status: 'GET /api/processor/status',
        execute: 'POST /api/processor/execute',
        start: 'POST /api/processor/start',
        stop: 'POST /api/processor/stop',
        history: 'GET /api/processor/history',
        clearHistory: 'DELETE /api/processor/history',
        reset: 'POST /api/processor/reset',
        algorithms: 'GET /api/processor/algorithms',
        performance: 'GET /api/processor/performance',
        circuit: 'POST /api/processor/circuit',
        metrics: 'GET /api/processor/metrics'
      },
      memory: {
        status: 'GET /api/memory/status',
        quantum: 'GET /api/memory/quantum',
        quantumOperation: 'POST /api/memory/quantum',
        classicalOperation: 'POST /api/memory/classical',
        quantumStates: 'GET /api/memory/quantum/states',
        entangle: 'POST /api/memory/quantum/entangle',
        measure: 'POST /api/memory/quantum/measure',
        quantumStats: 'GET /api/memory/quantum/stats',
        quantumGate: 'POST /api/memory/quantum/gate'
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Hybrid Processor Simulation API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
