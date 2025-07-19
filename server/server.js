const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./app/Middleware/ErrorMiddleware')
const logger = require('./utils/logger')
const { validateConfig } = require('./utils/configValidator')
const http = require('http')
const { sanitizeInput, requestSizeLimiter, ipSecurity, miningProtection } = require('./middleware/security');
const secureKeyManager = require('./utils/secureKeyManager');
const integrityMonitor = require('./utils/integrityMonitor');

// Validate configuration before starting
validateConfig()

// Initialize secure keys with proper error handling
try {
  const keys = secureKeyManager.generateKeysIfNeeded();
  process.env.privateKey = keys.privateKey;
  process.env.minorWallet = keys.publicKey;
  logger.success('Secure key management initialized');
} catch (error) {
  logger.error('FATAL: Failed to initialize secure keys:', error.message);
  logger.error('The blockchain cannot start without secure keys');
  process.exit(1);
}

// Verify keys are loaded before starting blockchain
if (!process.env.privateKey || !process.env.minorWallet) {
  logger.error('FATAL: Keys not properly loaded');
  process.exit(1);
}

// Start integrity monitoring
integrityMonitor.startPeriodicReset();

const port = process.env.PORT || 5000

const app = express()

// Security middleware stack (add before other middleware)
app.use(requestSizeLimiter);
app.use(ipSecurity);
app.use(sanitizeInput);
app.use(miningProtection);

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Powered-By', 'Blockchain Node'); // Hide Express
    next();
});

// Body parsing middleware with limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false, limit: '10mb' }))

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
    next();
});

app.use('/api', require('./routes/api'))
app.use('/docs', require('./routes/docs'))

app.use(errorHandler)

// Create HTTP server for WebSocket support
const server = http.createServer(app)

// Initialize WebSocket
const BlockchainWebSocket = require('./utils/websocket')
const wsHandler = new BlockchainWebSocket(server)

// Set blockchain and WebSocket references
const blockchainController = require('./app/Controllers/BlockchainController')
const { setBlockchain } = require('./controllers/StatsController')

// Initialize process monitoring
const ProcessMonitor = require('./utils/processMonitor');
new ProcessMonitor();

// Wait for blockchain initialization then set references
setTimeout(() => {
  if (blockchainController.myChain) {
    setBlockchain(blockchainController.myChain)
    blockchainController.setWebSocketHandler(wsHandler)
    logger.success('Blockchain and WebSocket integration completed')
  } else {
    logger.error('Failed to initialize blockchain')
  }
}, 1000)

server.listen(port, ()=> {
    logger.success(`Blockchain node running on port ${port}`)
    logger.info(`WebSocket server ready for connections`)
    logger.info(`API Documentation available at http://localhost:${port}/docs`)
})