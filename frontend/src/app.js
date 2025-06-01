const express = require('express');
const cors = require('./middleware/cors');
const processorRoutes = require('./routes/processor');
const memoryRoutes = require('./routes/memory');

const app = express();

// Middleware
app.use(cors);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'hybrid-processor-simulator',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/processor', processorRoutes);
app.use('/api/memory', memoryRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Hybrid Processor Simulator API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} is not a valid endpoint`,
    availableEndpoints: '/api'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;