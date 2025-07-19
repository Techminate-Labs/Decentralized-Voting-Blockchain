const crypto = require('crypto');
const logger = require('../utils/logger');

// Input sanitization
const sanitizeInput = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value.trim()
        .replace(/[<>\"']/g, '') // Remove dangerous characters
        .substring(0, 1000); // Limit length
    }
    return value;
  };

  // Sanitize request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitizeValue(req.body[key]);
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitizeValue(req.query[key]);
    });
  }

  next();
};

// Request size limiter
const requestSizeLimiter = (req, res, next) => {
  const contentLength = req.get('content-length');
  if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) { // 50MB limit
    logger.warn(`Large request blocked: ${contentLength} bytes from ${req.ip}`);
    return res.status(413).json({ error: 'Request too large' });
  }
  next();
};

// IP-based security
const ipSecurity = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Block localhost in production (except for health checks)
  if (process.env.NODE_ENV === 'production' && 
      req.path !== '/api/health' &&
      (clientIP === '127.0.0.1' || clientIP === '::1')) {
    logger.warn(`Localhost access blocked in production: ${req.path}`);
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};

// Mining protection - prevent mining spam
const miningProtection = (req, res, next) => {
  if (req.path === '/api/minePendingTxs') {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Store mining attempts per IP
    if (!global.miningAttempts) {
      global.miningAttempts = new Map();
    }
    
    const attempts = global.miningAttempts.get(clientIP) || [];
    const recentAttempts = attempts.filter(time => now - time < 300000); // 5 minutes
    
    if (recentAttempts.length >= 3) {
      logger.warn(`Mining spam detected from ${clientIP}`);
      return res.status(429).json({ error: 'Mining rate limit exceeded' });
    }
    
    recentAttempts.push(now);
    global.miningAttempts.set(clientIP, recentAttempts);
  }
  
  next();
};

module.exports = {
  sanitizeInput,
  requestSizeLimiter,
  ipSecurity,
  miningProtection
};
