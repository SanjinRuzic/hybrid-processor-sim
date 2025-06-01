const cors = (req, res, next) => {
    // Allow requests from frontend during development
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', // Vite default port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];
  
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    next();
  };
  
  module.exports = cors;