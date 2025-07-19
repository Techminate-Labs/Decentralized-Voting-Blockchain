# 🔗 Enterprise Blockchain Node

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Security](https://img.shields.io/badge/Security-Enterprise%20Grade-blue.svg)]()
[![WebSocket](https://img.shields.io/badge/WebSocket-Real%20Time-orange.svg)]()

A production-ready, enterprise-grade blockchain implementation built with Node.js, featuring advanced security, real-time capabilities, and comprehensive monitoring.

## 🌟 Features

### **Core Blockchain**
- ⛏️ **Proof of Work Mining** - Configurable difficulty consensus
- 💸 **Digital Transactions** - Cryptographically signed with secp256k1
- 🔗 **Chain Validation** - Complete integrity verification
- 🌍 **Multi-Node Network** - Distributed blockchain synchronization

### **Enterprise Security**
- 🔐 **Encrypted Key Storage** - AES-256-GCM encryption with PBKDF2
- 🛡️ **Multi-Layer Protection** - Input sanitization, rate limiting, CSRF protection
- 🔍 **Real-Time Monitoring** - Integrity monitoring and threat detection
- 📊 **Complete Audit Trail** - All operations logged with timestamps
- ⚡ **Attack Prevention** - DoS protection, injection prevention, mining spam protection

### **Advanced Features**
- 📡 **WebSocket Real-Time Updates** - Live transaction and mining notifications
- 📈 **Performance Metrics** - System monitoring and analytics
- 🏥 **Health Monitoring** - Comprehensive node status tracking
- 💾 **Data Persistence** - Blockchain state survives restarts
- 🔄 **Graceful Operations** - Proper startup, shutdown, and error recovery

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   WebSocket      │    │   REST API      │
│                 │    │   Real-time      │    │   HTTP/HTTPS    │
└─────┬───────────┘    └────────┬─────────┘    └─────┬───────────┘
      │                         │                    │
      └─────────────────────────┼────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │    Express Server     │
                    │   Security Layer      │
                    └───────────┬───────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼────────┐    ┌─────────▼────────┐    ┌─────────▼────────┐
│  Blockchain     │    │   Security       │    │   Monitoring     │
│  Core Engine    │    │   Services       │    │   & Metrics      │
│                 │    │                  │    │                  │
│ • Proof of Work │    │ • Key Management │    │ • Performance    │
│ • Transactions  │    │ • Audit Logging  │    │ • Health Checks  │
│ • Validation    │    │ • Rate Limiting  │    │ • Real-time Data │
│ • P2P Network   │    │ • Input Sanitize │    │ • Error Tracking │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 14+ (18+ recommended)
- Git
- Terminal/Command Prompt

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd "Blockchain Node 1"

# Install dependencies
npm install

# Create secure directory (Linux/macOS)
mkdir -p server/secure && chmod 700 server/secure

# Create secure directory (Windows)
mkdir server\secure
```

### **Development Setup**
```bash
# Run security check
npm run security-check

# Start development server
npm run serve

# The blockchain node will be running at http://localhost:8001
```

### **Production Deployment**
```bash
# Security validation and production start
npm run production

# Or manual production setup
NODE_ENV=production npm start
```

## 📚 API Documentation

### **Authentication**
Most endpoints are public for development. In production, implement proper authentication.

### **Core Endpoints**

#### **Health Check**
```http
GET /api/health
```
Returns node status, blockchain info, and system metrics.

#### **Generate Wallet**
```http
GET /api/generateKeys
```
Creates a new cryptographic keypair for blockchain transactions.

#### **Create Transaction**
```http
POST /api/transactionCreate
Content-Type: application/json

{
  "recipient": "04a1b2c3d4e5f6...", 
  "amount": 10.5
}
```

#### **Mine Block**
```http
GET /api/minePendingTxs
```
Processes pending transactions into a new block using Proof of Work.

#### **View Blockchain**
```http
GET /api/chainList
```
Returns the complete blockchain with all blocks and transactions.

#### **Validate Chain**
```http
GET /api/chainValidation
```
Verifies the cryptographic integrity of the entire blockchain.

#### **Network Operations**
```http
# Connect to other nodes
POST /api/nodeConnection
{
  "nodes": ["http://node2:8001", "http://node3:8001"]
}

# Synchronize with network
GET /api/chainSync

# Get statistics
GET /api/stats
```

### **WebSocket Connection**
```javascript
const ws = new WebSocket('ws://localhost:8001');

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Real-time update:', data.type, data.data);
};
```

## 🏗️ Code Architecture

### **Directory Structure**
```
h:\Blockchain\Node 1\
├── server/
│   ├── app/
│   │   ├── Blockchain/           # Core blockchain logic
│   │   │   ├── Block.js         # Block structure and mining
│   │   │   ├── Blockchain.js    # Main blockchain class
│   │   │   ├── Transaction.js   # Transaction handling
│   │   │   ├── Validation.js    # Chain validation logic
│   │   │   └── Network.js       # P2P networking
│   │   ├── Controllers/         # API endpoint handlers
│   │   │   ├── BlockchainController.js
│   │   │   └── WalletController.js
│   │   └── Middleware/          # Express middleware
│   │       └── ErrorMiddleware.js
│   ├── config/                  # Configuration files
│   │   └── blockchain.js        # Blockchain parameters
│   ├── controllers/             # Advanced controllers
│   │   └── StatsController.js   # Analytics and metrics
│   ├── middleware/              # Security and validation
│   │   ├── security.js          # Security middleware
│   │   ├── validation.js        # Input validation
│   │   ├── rateLimiter.js      # Rate limiting
│   │   └── enhancedValidation.js
│   ├── routes/                  # API routes
│   │   ├── api.js              # Main API routes
│   │   └── docs.js             # Documentation routes
│   ├── utils/                   # Utility functions
│   │   ├── logger.js           # Logging system
│   │   ├── metrics.js          # Performance metrics
│   │   ├── persistence.js      # Data storage
│   │   ├── websocket.js        # WebSocket handling
│   │   ├── secureKeyManager.js # Cryptographic key management
│   │   ├── integrityMonitor.js # Security monitoring
│   │   ├── auditLogger.js      # Audit trail
│   │   ├── configValidator.js  # Configuration validation
│   │   └── processMonitor.js   # Process management
│   └── server.js               # Main server file
├── scripts/                    # Utility scripts
│   ├── runTests.js            # Automated testing
│   ├── securityCheck.js       # Security validation
│   └── production-start.js    # Production launcher
├── .env                       # Environment configuration
├── .gitignore                # Git ignore rules
├── package.json              # Node.js dependencies
├── README.md                 # This file
├── TESTING.md               # Testing guide
└── ARCHITECTURE.md          # Detailed architecture
```

### **Core Classes**

#### **Block Class**
```javascript
class Block {
  constructor(timestamp, transactions, previousHash) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // For proof of work
  }
  
  // Proof of work mining
  mineBlock(difficulty) { ... }
  
  // SHA256 hash calculation
  calculateHash() { ... }
  
  // Validate all transactions in block
  hasValidTransactions() { ... }
}
```

#### **Blockchain Class**
```javascript
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.nodes = [];
  }
  
  // Add new transactions
  addTransaction(transaction) { ... }
  
  // Mine pending transactions
  minePendingTransactions(miningRewardAddress) { ... }
  
  // Validate entire chain
  isChainValid() { ... }
  
  // Network synchronization
  replaceChain() { ... }
}
```

#### **Transaction Class**
```javascript
class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }
  
  // Sign with private key
  signTransaction(keyPair) { ... }
  
  // Verify signature
  isValid() { ... }
  
  // Calculate transaction hash
  calculateHash() { ... }
}
```

## 🔒 Security Features

### **Cryptographic Security**
- **Elliptic Curve Cryptography**: secp256k1 for transaction signatures
- **SHA-256 Hashing**: For block and transaction integrity
- **Proof of Work**: Prevents spam and ensures consensus
- **Key Encryption**: AES-256-GCM with PBKDF2 key derivation

### **Network Security**
- **Rate Limiting**: Prevents DoS attacks (5 tx/min, 2 mining/min)
- **Input Sanitization**: XSS and injection protection
- **Request Size Limits**: 50MB maximum request size
- **IP-based Controls**: Production access restrictions

### **Operational Security**
- **Audit Logging**: Every operation logged with timestamps
- **Integrity Monitoring**: Real-time tamper detection
- **Secure Storage**: Encrypted key files with restricted permissions
- **Graceful Shutdown**: Proper state saving on exit

## 🧪 Testing

### **Run All Tests**
```bash
# Security validation
npm run security-check

# Automated test suite
node scripts/runTests.js

# Manual API testing (see TESTING.md)
curl http://localhost:8001/api/health
```

### **Test Coverage**
- ✅ Core blockchain functionality
- ✅ Transaction creation and validation
- ✅ Block mining and proof of work
- ✅ Chain synchronization
- ✅ Security features and rate limiting
- ✅ WebSocket real-time updates
- ✅ Error handling and recovery

See [TESTING.md](TESTING.md) for comprehensive testing guide.

## 🔧 Configuration

### **Environment Variables**
```bash
# .env file
NODE_ENV=development          # development | production
PORT=8001                    # Server port
SECURE_KEY_STORAGE=true      # Enable encrypted key storage
ENABLE_KEY_GENERATION=true   # Auto-generate keys on startup
```

### **Blockchain Parameters**
```javascript
// server/config/blockchain.js
module.exports = {
  DIFFICULTY: 2,              // Mining difficulty
  MINING_REWARD: 100,         # Reward per mined block
  MAX_PENDING_TRANSACTIONS: 100,
  MAX_BLOCK_SIZE: 10,
  RATE_LIMIT: {
    TRANSACTION: { max: 5, window: 60000 },
    MINING: { max: 2, window: 60000 }
  }
};
```

## 📊 Monitoring & Metrics

### **Performance Metrics**
- Transaction throughput (tx/second)
- Block mining time (seconds)  
- Memory usage (MB)
- Network latency (ms)
- Error rates (%)

### **Health Monitoring**
```bash
# Real-time health check
curl http://localhost:8001/api/health

# Detailed statistics  
curl http://localhost:8001/api/stats

# System metrics
curl http://localhost:8001/api/health | jq '.system'
```

### **Audit Logs**
```bash
# View recent activity
tail -f server/logs/audit.log

# Search specific events
grep "TRANSACTION_CREATED" server/logs/audit.log
grep "SECURITY_EVENT" server/logs/audit.log
```

## 🌐 Network & Multi-Node Setup

### **Connect Multiple Nodes**
```bash
# Start nodes on different ports
PORT=8001 npm start &  # Node 1
PORT=8002 npm start &  # Node 2
PORT=8003 npm start &  # Node 3

# Connect nodes together
curl -X POST http://localhost:8001/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{"nodes": ["http://localhost:8002", "http://localhost:8003"]}'

# Synchronize chains
curl http://localhost:8001/api/chainSync
```

### **Network Topology**
```
     Node 1 (8001) ←→ Node 2 (8002)
           ↕               ↕
     Node 4 (8004) ←→ Node 3 (8003)
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Run** tests (`npm run security-check && node scripts/runTests.js`)
4. **Commit** changes (`git commit -m 'Add amazing feature'`)
5. **Push** to branch (`git push origin feature/amazing-feature`)
6. **Create** a Pull Request

### **Code Standards**
- Follow existing code style and patterns
- Add comprehensive tests for new features
- Update documentation for API changes
- Ensure all security checks pass
- Add audit logging for new operations

### **Security Guidelines**
- Never commit private keys or sensitive data
- All user inputs must be validated and sanitized
- New endpoints require rate limiting consideration
- Security-related changes need thorough review
- Always run security checks before submission

## 🚀 Deployment

### **Production Checklist**
- [ ] Environment variables configured
- [ ] SSL/TLS certificates installed
- [ ] Firewall rules configured
- [ ] Log rotation setup
- [ ] Monitoring alerts configured
- [ ] Backup strategy implemented
- [ ] Security audit completed

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN mkdir -p server/secure && chmod 700 server/secure
EXPOSE 8001
CMD ["npm", "run", "production"]
```

### **Reverse Proxy (Nginx)**
```nginx
server {
    listen 443 ssl;
    server_name blockchain.example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Elliptic Curve Cryptography**: Built on the battle-tested `elliptic` library
- **Express.js**: Robust web framework for Node.js
- **WebSocket**: Real-time communication with `ws` library
- **Security**: Following OWASP security best practices
- **Community**: Thanks to all contributors and users

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Security**: Report security issues privately to security@example.com
- **Documentation**: [Full Documentation](https://blockchain-docs.example.com)

---

**⚠️ Production Notice**: This blockchain implements enterprise-grade security. Always run comprehensive security checks before production deployment. Regular security audits are recommended.

**🔒 Security First**: This project prioritizes security and follows industry best practices. All security-related contributions are thoroughly reviewed.

**🌟 Star this repo** if you find it useful! Your support helps us continue improving this open-source blockchain implementation.
