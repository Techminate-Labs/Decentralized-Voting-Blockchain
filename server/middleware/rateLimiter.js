const rateLimitMap = new Map();

const rateLimit = (maxRequests = 10, windowMs = 60000) => {
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create client record
    if (!rateLimitMap.has(clientId)) {
      rateLimitMap.set(clientId, []);
    }

    const requests = rateLimitMap.get(clientId);
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        message: `Maximum ${maxRequests} requests per ${windowMs / 1000} seconds`,
        retryAfter: Math.ceil((recentRequests[0] - windowStart) / 1000)
      });
    }

    // Add current request
    recentRequests.push(now);
    rateLimitMap.set(clientId, recentRequests);

    next();
  };
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [clientId, requests] of rateLimitMap.entries()) {
    const recentRequests = requests.filter(timestamp => now - timestamp < 300000); // 5 minutes
    if (recentRequests.length === 0) {
      rateLimitMap.delete(clientId);
    } else {
      rateLimitMap.set(clientId, recentRequests);
    }
  }
}, 60000); // Clean up every minute

module.exports = { rateLimit };
