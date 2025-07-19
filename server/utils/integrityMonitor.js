const crypto = require('crypto');
const logger = require('./logger');

class IntegrityMonitor {
  constructor() {
    this.lastKnownHash = null;
    this.alertThreshold = 5; // Alert after 5 suspicious activities
    this.suspiciousActivity = 0;
  }

  // Monitor for blockchain tampering
  validateChainIntegrity(blockchain) {
    const chainHash = this.calculateChainHash(blockchain);
    
    if (this.lastKnownHash && this.lastKnownHash !== chainHash) {
      this.suspiciousActivity++;
      logger.warn(`Chain integrity changed. Suspicious activity count: ${this.suspiciousActivity}`);
      
      if (this.suspiciousActivity >= this.alertThreshold) {
        this.triggerSecurityAlert('CHAIN_TAMPERING_DETECTED');
      }
    }
    
    this.lastKnownHash = chainHash;
    return true;
  }

  calculateChainHash(blockchain) {
    const chainData = JSON.stringify({
      length: blockchain.chain.length,
      lastBlockHash: blockchain.getLatestBlock().hash,
      totalTransactions: blockchain.chain.reduce((sum, block) => sum + block.transactions.length, 0)
    });
    
    return crypto.createHash('sha256').update(chainData).digest('hex');
  }

  // Monitor for unusual transaction patterns
  analyzeTransactionPattern(transaction) {
    const suspiciousPatterns = [
      this.checkLargeTransaction(transaction),
      this.checkRapidTransactions(transaction),
      this.checkSelfTransfer(transaction)
    ];

    const suspiciousCount = suspiciousPatterns.filter(Boolean).length;
    
    if (suspiciousCount >= 2) {
      logger.warn(`Suspicious transaction detected: ${transaction.calculateHash()}`);
      this.suspiciousActivity++;
    }
  }

  checkLargeTransaction(tx) {
    return tx.amount > 100000; // Flag transactions over 100k
  }

  checkRapidTransactions(tx) {
    // Check if this address has made multiple transactions recently
    const now = Date.now();
    if (!this.recentTransactions) {
      this.recentTransactions = new Map();
    }

    const addressTxs = this.recentTransactions.get(tx.fromAddress) || [];
    const recentTxs = addressTxs.filter(time => now - time < 60000); // 1 minute

    if (recentTxs.length > 10) {
      return true;
    }

    recentTxs.push(now);
    this.recentTransactions.set(tx.fromAddress, recentTxs);
    return false;
  }

  checkSelfTransfer(tx) {
    return tx.fromAddress === tx.toAddress;
  }

  triggerSecurityAlert(type) {
    logger.error(`🚨 SECURITY ALERT: ${type}`);
    
    // In production, this could:
    // - Send email/SMS alerts
    // - Temporarily disable certain operations
    // - Create security incident report
    
    // Reset counter after alert
    this.suspiciousActivity = 0;
  }

  // Reset suspicious activity counter periodically
  startPeriodicReset() {
    setInterval(() => {
      if (this.suspiciousActivity > 0) {
        this.suspiciousActivity = Math.max(0, this.suspiciousActivity - 1);
      }
    }, 300000); // Reduce by 1 every 5 minutes
  }
}

module.exports = new IntegrityMonitor();
