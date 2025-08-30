# 🚀 Complete Blockchain Setup Guide

**From Zero to Production-Ready Multi-Node Blockchain Network**

This guide will take you through setting up a fully functional, enterprise-grade blockchain network from the very beginning.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Single Node Setup](#single-node-setup)
4. [Multi-Node Network Setup](#multi-node-network-setup)
5. [Testing and Validation](#testing-and-validation)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.0 or higher
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: At least 1GB free space
- **Network**: Internet connection for initial setup

### Required Software
```bash
# Check if Node.js is installed
node --version    # Should show v18.0.0 or higher
npm --version     # Should show 8.0.0 or higher

# Install Node.js if not present:
# Visit: https://nodejs.org/en/download/
```

### Development Tools (Optional but Recommended)
- **Git**: For version control
- **VS Code**: For code editing
- **Postman**: For API testing
- **Terminal/Command Prompt**: For running commands

---

## Initial Setup

### Step 1: Download the Project

**Option A: Clone from Repository**
```bash
git clone https://github.com/Techminate-Labs/Decentralized-Voting-Blockchain.git
cd "Decentralized-Voting-Blockchain"
```

**Option B: Extract from ZIP**
```bash
# Extract the project files to a directory
# Navigate to the extracted folder
cd "path/to/blockchain/project"
```

### Step 2: Install Dependencies

```bash
# Navigate to the project directory
cd "Blockchain/Node 1"  # or wherever your project is located

# Install all required packages
npm install

# Verify installation
npm list --depth=0
```

**Expected output should show packages like:**
```
├── axios@0.27.2
├── colors@1.4.0
├── dotenv@16.0.0
├── elliptic@6.5.4
├── express@4.17.3
└── ws@8.13.0
```

### Step 3: Environment Configuration

```bash
# Check if .env file exists
ls -la .env

# If .env doesn't exist, create it:
cp .env.example .env  # if .env.example exists
# OR create manually with the content below:
```

**Create `.env` file with:**
```properties
NODE_ENV=development
PORT=8001
ENABLE_KEY_GENERATION=true
SECURE_KEY_STORAGE=true
```

---

## Single Node Setup

### Step 1: Security Check

Before starting, run the security validation:

```bash
npm run security-check
```

**Expected output:**
```
✅ Configuration validation passed
✅ Secure key management initialized
✅ Security checks completed successfully
```

### Step 2: Start Your First Blockchain Node

```bash
# For development (recommended for testing)
npm run serve

# OR for production
npm run production

# OR basic start
npm start
```

**Successful startup should show:**
```
[SUCCESS] Blockchain node running on port 8001
[INFO] WebSocket server ready for connections
[INFO] API Documentation available at http://localhost:8001/docs
[SUCCESS] Blockchain and WebSocket integration completed
```

### Step 3: Verify Node is Running

Open a new terminal and test:

```bash
# Health check
curl http://localhost:8001/api/health

# Expected response:
{
  "status": "healthy",
  "blockchain": {
    "chainLength": 1,
    "pendingTxs": 0,
    "connectedNodes": 0
  }
}
```

### Step 4: Generate Your First Wallet

```bash
curl http://localhost:8001/api/generateKeys
```

**Save the output carefully:**
```json
{
  "Public key": "04fd90f7fe7425f10d4d1ae13c543c3a7fa86678cab738a8c80b35786d23e2f255eece1010d45e660a1438e1a648752b541f4d0e78398f97cc732922f1fd41b6ba",
  "Private key": "33df38e0871c07248c3b9358e20dc4f2bfa0d5eb9fd046835f7b0e68ea4e233a",
  "warning": "Store private key securely - never share it"
}
```

⚠️ **IMPORTANT:** Save your private key securely! It's needed for creating transactions.

### Step 5: Get Your First Coins (Bootstrap Mining)

Since this is a new blockchain, you need initial coins:

```bash
curl http://localhost:8001/api/bootstrapMine
```

**Expected response:**
```json
{
  "message": "Bootstrap mining successful! You now have initial funds.",
  "newBalance": 100,
  "rewardReceived": 100
}
```

### Step 6: View Your Blockchain

```bash
curl http://localhost:8001/api/chainList
```

You should now see 2 blocks:
- Block 0: Genesis block (empty)
- Block 1: Your first mined block with mining reward

### Step 7: Create Your First Transaction

```bash
# Replace PUBLIC_KEY with the public key from Step 4
curl -X POST http://localhost:8001/api/transactionCreate \
  -H "Content-Type: application/json" \
  -d '{"recipient":"PUBLIC_KEY_HERE","amount":25}'
```

### Step 8: Mine Your Transaction

```bash
curl http://localhost:8001/api/minePendingTxs
```

**Congratulations! You now have a working blockchain with:**
- ✅ Genesis block
- ✅ Mining rewards (200 total: 100 + 100)
- ✅ Your first transaction (25 sent)
- ✅ 3 blocks total

---

## Multi-Node Network Setup

### Step 1: Create a Second Node

```bash
# Navigate to the parent directory
cd ..  # Go up one level from "Node 1"

# Copy the entire node
cp -r "Node 1" "Node 2"

# On Windows use:
# xcopy "Node 1" "Node 2" /E /I /H
```

### Step 2: Start Node 2

Open a new terminal:

```bash
cd "Node 2"

# Start on a different port
PORT=8002 npm start
```

**Both nodes should now be running:**
- Node 1: http://localhost:8001
- Node 2: http://localhost:8002

### Step 3: Connect the Nodes

```bash
# Connect Node 1 to Node 2
curl -X POST http://localhost:8001/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{"nodes": ["http://localhost:8002"]}'

# Connect Node 2 to Node 1 (bidirectional)
curl -X POST http://localhost:8002/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{"nodes": ["http://localhost:8001"]}'
```

**Expected response:**
```json
{
  "message": "Connected to the network",
  "node_list": ["http://localhost:8002"]
}
```

### Step 4: Synchronize the Blockchains

```bash
# Sync Node 2 with Node 1's blockchain
curl http://localhost:8002/api/chainSync
```

**Expected response:**
```json
"Chain synchronization completed!"
```

### Step 5: Verify Network Status

```bash
# Check Node 1
curl -s http://localhost:8001/api/health | grep -E '"chainLength"|"connectedNodes"'

# Check Node 2  
curl -s http://localhost:8002/api/health | grep -E '"chainLength"|"connectedNodes"'
```

**Both should show:**
- Same `chainLength` (synchronized)
- `connectedNodes: 1` (connected to each other)

### Step 6: Test Cross-Node Transaction

```bash
# Create transaction on Node 1
curl -X POST http://localhost:8001/api/transactionCreate \
  -H "Content-Type: application/json" \
  -d '{"recipient":"RECIPIENT_KEY","amount":50}'

# Mine the block
curl http://localhost:8001/api/minePendingTxs

# Sync Node 2 to get the new block
curl http://localhost:8002/api/chainSync
```

🎉 **You now have a fully functional multi-node blockchain network!**

---

## Testing and Validation

### Automated Test Suite

```bash
# Run comprehensive tests
node scripts/runTests.js
```

**Expected results:**
```
✅ Health Check - PASSED
✅ Key Generation - PASSED  
✅ Chain Validation - PASSED
✅ Stats Check - PASSED
✅ Block Mining - PASSED
✅ Security Active - Balance protection working
✅ Security Active - Economic rules enforced

📊 Perfect Score: 7/7 (5 functions + 2 security blocks)
```

### Manual API Testing

**1. Health Check**
```bash
curl http://localhost:8001/api/health
```

**2. Blockchain View**
```bash
curl http://localhost:8001/api/chainList
```

**3. Statistics**
```bash
curl http://localhost:8001/api/stats
```

**4. Chain Validation**
```bash
curl http://localhost:8001/api/chainValidation
```

### WebSocket Real-Time Testing

Create an HTML file to test WebSocket connections:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Blockchain WebSocket Test</title>
</head>
<body>
    <div id="output"></div>
    <script>
        const ws = new WebSocket('ws://localhost:8001');
        const output = document.getElementById('output');
        
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            output.innerHTML += '<p>' + data.type + ': ' + JSON.stringify(data.data) + '</p>';
        };
        
        ws.onopen = function() {
            output.innerHTML += '<p>Connected to blockchain WebSocket</p>';
        };
    </script>
</body>
</html>
```

---

## Production Deployment

### Security Hardening

**1. Update Environment Variables**
```properties
NODE_ENV=production
PORT=8001
LOG_LEVEL=warn
MAX_CONNECTIONS=50
CORS_ORIGIN=your-domain.com
```

**2. Set Proper File Permissions (Linux/macOS)**
```bash
chmod 700 server/secure/
chmod 600 server/secure/*
```

**3. Use Production Start**
```bash
npm run production
```

### Docker Deployment

**Create Dockerfile:**
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

**Build and Run:**
```bash
docker build -t blockchain-node .
docker run -p 8001:8001 -v blockchain-data:/app/server/secure blockchain-node
```

### Reverse Proxy Setup (Nginx)

```nginx
server {
    listen 443 ssl;
    server_name blockchain.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## Troubleshooting

### Common Issues and Solutions

**1. Port Already in Use**
```bash
# Error: EADDRINUSE: address already in use
# Solution: Use different port or kill existing process
PORT=8002 npm start

# Or kill existing process (Windows)
taskkill /F /IM node.exe

# Or (Linux/macOS)
pkill -f "node.*server.js"
```

**2. Permission Errors (Linux/macOS)**
```bash
# Error: EACCES permission denied
# Solution: Set proper permissions
chmod 755 server/
chmod -R 644 server/**
chmod +x server/server.js
```

**3. Key Generation Fails**
```bash
# Error: Failed to initialize secure keys
# Solution: Create secure directory manually
mkdir -p server/secure
chmod 700 server/secure
```

**4. Blockchain Won't Sync**
```bash
# Check if nodes are connected
curl http://localhost:8001/api/health | grep connectedNodes

# If 0, reconnect nodes
curl -X POST http://localhost:8001/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{"nodes": ["http://localhost:8002"]}'

# Then trigger sync
curl http://localhost:8001/api/chainSync
```

**5. Transaction Fails - Insufficient Balance**
```bash
# This is normal! Get coins first:
curl http://localhost:8001/api/bootstrapMine  # For new chains
# OR
curl http://localhost:8001/api/minePendingTxs  # If you have pending transactions
```

**6. WebSocket Connection Fails**
```bash
# Check if WebSocket is enabled in logs
# Look for: "WebSocket server ready for connections"
# Test with: ws://localhost:8001
```

### Network Troubleshooting Commands

```bash
# Check if port is listening
netstat -an | grep :8001

# Test API endpoints
curl -I http://localhost:8001/api/health

# Check node logs
tail -f server/logs/audit.log

# Validate blockchain integrity
curl http://localhost:8001/api/chainValidation
```

### Performance Optimization

**1. Node.js Optimization**
```bash
# Set Node.js flags for better performance
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

**2. Database-like Persistence (Optional)**
```bash
# The blockchain uses file-based storage by default
# For high-performance needs, consider integrating:
# - Redis for caching
# - MongoDB for transaction history  
# - PostgreSQL for analytics
```

---

## Advanced Configuration

### Environment Variables Reference

```properties
# Server Configuration
NODE_ENV=development|production          # Deployment mode
PORT=8001                               # Server port

# Security Settings
ENABLE_KEY_GENERATION=true              # Auto-generate keys on startup
SECURE_KEY_STORAGE=true                 # Use encrypted key storage

# Optional Advanced Settings
LOG_LEVEL=info|warn|error               # Logging verbosity
MAX_CONNECTIONS=100                     # Maximum concurrent connections
CORS_ORIGIN=*                           # CORS allowed origins
API_VERSION=v1                          # API version prefix
```

### Blockchain Configuration

Edit `server/config/blockchain.js`:

```javascript
module.exports = {
  DIFFICULTY: 2,                    // Mining difficulty (higher = slower)
  MINING_REWARD: 100,              # Tokens per mined block
  MAX_PENDING_TRANSACTIONS: 100,    // Queue size limit
  MAX_BLOCK_SIZE: 10,              // Transactions per block
  
  // Rate limiting (requests per window)
  RATE_LIMIT: {
    TRANSACTION: { max: 5, window: 60000 },    // 5 tx per minute
    MINING: { max: 2, window: 60000 }          // 2 mining per minute
  }
};
```

---

## API Reference

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Node status and metrics |
| `/api/generateKeys` | GET | Generate new wallet |
| `/api/transactionCreate` | POST | Create new transaction |
| `/api/minePendingTxs` | GET | Mine pending transactions |
| `/api/bootstrapMine` | GET | Initial mining for new chains |
| `/api/chainList` | GET | View complete blockchain |
| `/api/chainValidation` | GET | Validate blockchain integrity |
| `/api/stats` | GET | Blockchain statistics |
| `/api/nodeConnection` | POST | Connect to network nodes |
| `/api/chainSync` | GET | Synchronize with network |

### Transaction Format

```json
{
  "recipient": "04fd90f7fe7425f10d4d1ae13c543c3a7fa86678cab738a8c80b35786d23e2f255eece1010d45e660a1438e1a648752b541f4d0e78398f97cc732922f1fd41b6ba",
  "amount": 25.5
}
```

### WebSocket Events

- `new_transaction`: New transaction created
- `new_block`: Block successfully mined  
- `chain_sync`: Blockchain synchronized
- `connection`: Node connected/disconnected

---

## Success Checklist

### Single Node ✅
- [ ] Node.js and npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment configured (`.env` file)
- [ ] Security check passed (`npm run security-check`)
- [ ] Node started successfully
- [ ] Health check returns healthy status
- [ ] Wallet generated and saved
- [ ] Bootstrap mining completed (initial 100 tokens)
- [ ] First transaction created and mined
- [ ] Blockchain shows multiple blocks

### Multi-Node Network ✅
- [ ] Second node copied and started
- [ ] Nodes connected to each other (`connectedNodes: 1`)
- [ ] Blockchain synchronized (`chainSync` completed)
- [ ] Cross-node transactions working
- [ ] Both nodes show same chain length
- [ ] Network survives node restarts

### Production Ready ✅
- [ ] Environment set to production
- [ ] Security hardened (file permissions, etc.)
- [ ] SSL/HTTPS configured
- [ ] Reverse proxy setup (optional)
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
- [ ] Documentation completed

---

## 🎉 Congratulations!

You now have a fully functional, enterprise-grade blockchain network running from scratch!

### What You've Built:
- ✅ **Multi-node blockchain network** with automatic synchronization
- ✅ **Proof of Work consensus** with configurable difficulty
- ✅ **Digital transactions** with cryptographic signatures
- ✅ **Real-time WebSocket updates** across the network
- ✅ **Enterprise security** with encrypted key storage
- ✅ **Complete audit trail** and monitoring
- ✅ **Production-ready** architecture

### Next Steps:
1. **Scale the Network**: Add more nodes (3, 5, 10+)
2. **Build Applications**: Create web/mobile apps using your blockchain
3. **Add Features**: Smart contracts, transaction fees, governance
4. **Deploy Globally**: Use cloud providers for worldwide distribution
5. **Integrate Systems**: Connect to existing applications and databases

**Your blockchain is now ready for real-world applications!** 🚀

---

## Support and Resources

- **Project Repository**: [GitHub](https://github.com/Techminate-Labs/Decentralized-Voting-Blockchain)
- **API Documentation**: http://localhost:8001/docs (when running)
- **Testing Guide**: See `TESTING.md` for comprehensive testing procedures
- **Multi-Node Guide**: See `NodeConnection.md` for advanced networking

**Need Help?** 
- Check the troubleshooting section above
- Review the project logs in `server/logs/`
- Test with the automated test suite: `node scripts/runTests.js`

---

*This documentation was created for the Enterprise Blockchain Project - Built with ❤️ for decentralized applications*
