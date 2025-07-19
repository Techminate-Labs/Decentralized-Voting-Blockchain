const logger = require('./logger');

class ProcessMonitor {
  constructor() {
    this.setupProcessHandlers();
    this.startHealthCheck();
  }

  setupProcessHandlers() {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      // Give time for logging before exit
      setTimeout(() => process.exit(1), 1000);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Handle process termination gracefully
    process.on('SIGTERM', this.gracefulShutdown);
    process.on('SIGINT', this.gracefulShutdown);
  }

  gracefulShutdown(signal) {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    // Save blockchain state
    try {
      const { saveBlockchain } = require('./persistence');
      const { myChain } = require('../app/Controllers/BlockchainController');
      if (myChain && myChain.chain && myChain.chain.length > 1) {
        saveBlockchain(myChain);
        logger.success('Blockchain state saved before shutdown');
      }
    } catch (error) {
      logger.error('Error saving blockchain during shutdown:', error.message);
    }
    
    // Audit the shutdown
    try {
      const auditLogger = require('./auditLogger');
      auditLogger.log('SYSTEM_SHUTDOWN', { signal, timestamp: Date.now() });
    } catch (error) {
      logger.error('Error logging shutdown audit:', error.message);
    }
    
    setTimeout(() => {
      logger.info('Blockchain node shutdown complete');
      process.exit(0);
    }, 2000);
  }

  startHealthCheck() {
    // Monitor memory usage
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      
      if (memUsageMB > 500) { // Alert if using more than 500MB
        logger.warn(`High memory usage: ${memUsageMB}MB`);
      }
    }, 60000); // Check every minute
  }
}

module.exports = ProcessMonitor;
