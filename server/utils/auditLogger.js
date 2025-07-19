const fs = require('fs');
const path = require('path');

class AuditLogger {
  constructor() {
    this.auditFile = path.join(__dirname, '..', 'logs', 'audit.log');
    this.ensureLogDir();
  }

  ensureLogDir() {
    const logDir = path.dirname(this.auditFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(event, details, clientIP = 'unknown') {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      clientIP,
      sessionId: this.generateSessionId()
    };

    const logLine = JSON.stringify(auditEntry) + '\n';
    
    try {
      fs.appendFileSync(this.auditFile, logLine);
    } catch (error) {
      console.error('Failed to write audit log:', error.message);
    }
  }

  generateSessionId() {
    return require('crypto').randomBytes(8).toString('hex');
  }

  // Specific audit events
  logTransaction(transaction, clientIP) {
    this.log('TRANSACTION_CREATED', {
      from: transaction.fromAddress,
      to: transaction.toAddress,
      amount: transaction.amount,
      hash: transaction.calculateHash()
    }, clientIP);
  }

  logBlockMined(block, clientIP) {
    this.log('BLOCK_MINED', {
      blockHash: block.hash,
      transactions: block.transactions.length,
      timestamp: block.timestamp
    }, clientIP);
  }

  logSecurityEvent(eventType, details, clientIP) {
    this.log('SECURITY_EVENT', {
      type: eventType,
      ...details
    }, clientIP);
  }
}

module.exports = new AuditLogger();
