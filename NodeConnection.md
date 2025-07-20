# 🌐 Multi-Node Blockchain Network Guide

This guide provides step-by-step instructions for setting up and testing a multi-node blockchain network.

## 📋 Prerequisites

- Multiple terminal windows/tabs
- Node.js 14+ installed
- Basic understanding of REST APIs
- curl or similar HTTP client tool

## 🔄 **Multi-Node Setup Options**

### **Option 1: Copy Directory Method (Recommended)**

This creates completely independent nodes with separate blockchain states, keys, and logs.

```bash
# Navigate to parent directory
cd /h/Blockchain/

# Copy the entire node directory
cp -r "Node 1" "Node 2"

# Optional: Create additional nodes
cp -r "Node 1" "Node 3"
cp -r "Node 1" "Node 4"
```

**Windows Users:**
```cmd
# Using Command Prompt
cd h:\Blockchain\
xcopy "Node 1" "Node 2" /E /I

# Using PowerShell
cd h:\Blockchain\
Copy-Item "Node 1" -Destination "Node 2" -Recurse
```

### **Option 2: Same Directory Method**

Run multiple instances from the same directory using different ports.

```bash
# All nodes share the same blockchain state initially
# Each gets different ports but same underlying data
```

## 🚀 **Complete Multi-Node Setup Workflow**

### **Step 1: Start Multiple Nodes**

Open separate terminal windows for each node:

**Terminal 1 (Node 1):**
```bash
cd "h:\Blockchain\Node 1"
PORT=8001 npm run serve
```

**Terminal 2 (Node 2):**
```bash
cd "h:\Blockchain\Node 2"  # If using copied directory
PORT=8002 npm run serve
```

**Terminal 3 (Node 3) - Optional:**
```bash
cd "h:\Blockchain\Node 3"  # If using copied directory
PORT=8003 npm run serve
```

**Expected Startup for Each Node:**
```
[SUCCESS] Configuration validation passed
[INFO] Generating secure keys...
[SUCCESS] Secure keys generated and stored
[SUCCESS] Secure key management initialized
[SUCCESS] Blockchain node running on port XXXX
[INFO] WebSocket server ready for connections
```

### **Step 2: Verify Node Independence**

Each node should have its own:

```bash
# Check Node 1 health
curl http://localhost:8001/api/health

# Check Node 2 health  
curl http://localhost:8002/api/health

# Check Node 3 health
curl http://localhost:8003/api/health
```

**What to Look For:**
- Different `pid` (process IDs)
- Different `blockchain.chainLength` (initially all should be 1)
- Different `connectedNodes` count (initially 0)

### **Step 3: Connect Nodes to Form Network**

**Terminal 4 (Network Management):**

#### **Connect Node 1 to Node 2:**
```bash
curl -X POST http://localhost:8001/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": ["http://localhost:8002"]
  }'
```

**Expected Response:**
```json
{
  "message": "Connected to the network",
  "node_list": ["http://localhost:8002"]
}
```

#### **Connect Node 2 to Node 1 (Bidirectional):**
```bash
curl -X POST http://localhost:8002/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": ["http://localhost:8001"]
  }'
```

#### **Add Node 3 to the Network:**
```bash
# Connect Node 1 to Node 3
curl -X POST http://localhost:8001/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": ["http://localhost:8003"]
  }'

# Connect Node 3 to Node 1 and Node 2
curl -X POST http://localhost:8003/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": ["http://localhost:8001", "http://localhost:8002"]
  }'
```

### **Step 4: Verify Network Connections**

```bash
# Check Node 1's connected nodes
curl -s http://localhost:8001/api/health | grep -A5 "connectedNodes"

# Check Node 2's connected nodes
curl -s http://localhost:8002/api/health | grep -A5 "connectedNodes"

# Check Node 3's connected nodes (if created)
curl -s http://localhost:8003/api/health | grep -A5 "connectedNodes"
```

**Expected Output (Node 1):**
```json
{
  "blockchain": {
    "chainLength": 1,
    "pendingTxs": 0,
    "connectedNodes": 2
  }
}
```

## 🔗 **Network Topology Examples**

### **2-Node Network:**
```
Node 1 (8001) ←→ Node 2 (8002)
```

### **3-Node Network:**
```
     Node 1 (8001)
        ↙    ↘
Node 2 (8002) ←→ Node 3 (8003)
```

### **4-Node Full Mesh:**
```
Node 1 (8001) ←→ Node 2 (8002)
     ↕               ↕
Node 4 (8004) ←→ Node 3 (8003)
```

## 🔄 **Blockchain Synchronization Testing**

### **Step 5: Test Chain Synchronization**

#### **View Initial Blockchain State:**
```bash
# Check Node 1's blockchain
curl http://localhost:8001/api/chainList

# Check Node 2's blockchain
curl http://localhost:8002/api/chainList

# They should be identical initially (both have only genesis block)
```

#### **Force Synchronization:**
```bash
# Synchronize Node 1 with network
curl http://localhost:8001/api/chainSync

# Synchronize Node 2 with network
curl http://localhost:8002/api/chainSync
```

**Expected Response:**
```json
"No longer valid chain found"
```
*This is normal when all nodes have identical chains.*

### **Step 6: Generate Wallets for Each Node**

```bash
# Generate wallet for Node 1
curl http://localhost:8001/api/generateKeys > node1_wallet.json

# Generate wallet for Node 2
curl http://localhost:8002/api/generateKeys > node2_wallet.json

# Generate wallet for Node 3 (if exists)
curl http://localhost:8003/api/generateKeys > node3_wallet.json
```

**Save the public keys - you'll need them for testing transactions between nodes.**

## 💸 **Cross-Node Transaction Testing**

### **Understanding the Balance Problem**

All nodes start with 0 balance. In a real blockchain network, initial balance comes from:
- Other users sending transactions
- Mining rewards from network participation
- Initial token distribution
- Exchange purchases

### **Current Limitation**
Since our blockchain follows standard rules:
- **No empty block mining** (prevents balance generation)
- **No spending without balance** (prevents fraud)
- **Initial balance must come from network** (economic model)

### **Testing Network Communication**

Even without balance, you can test network communication:

```bash
# Try creating transaction on Node 1 (will fail due to balance)
curl -X POST http://localhost:8001/api/transactionCreate \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "PUBLIC_KEY_FROM_NODE_2",
    "amount": 10
  }'

# Expected response: "Insufficient balance" - this proves security works!
```

### **Test Network Propagation**

```bash
# Check pending transactions on all nodes
curl http://localhost:8001/api/health | grep pendingTxs
curl http://localhost:8002/api/health | grep pendingTxs

# Try mining on each node
curl http://localhost:8001/api/minePendingTxs
curl http://localhost:8002/api/minePendingTxs

# Expected: "No pending transactions to mine" - proves mining rules work!
```

## 📊 **Network Monitoring & Statistics**

### **Monitor Network Health**

```bash
# Real-time network status
watch -n 5 'curl -s http://localhost:8001/api/health | jq ".blockchain"'

# View detailed statistics
curl http://localhost:8001/api/stats | jq
curl http://localhost:8002/api/stats | jq
curl http://localhost:8003/api/stats | jq
```

### **Check Node Synchronization**

```bash
# Compare chain lengths (should be identical)
echo "Node 1 Chain Length:"
curl -s http://localhost:8001/api/stats | jq '.chainLength'

echo "Node 2 Chain Length:"
curl -s http://localhost:8002/api/stats | jq '.chainLength'

echo "Node 3 Chain Length:"
curl -s http://localhost:8003/api/stats | jq '.chainLength'
```

### **Network Topology Visualization**

```bash
# Check each node's connected peers
echo "=== Network Topology ==="
echo "Node 1 peers:"
curl -s http://localhost:8001/api/health | jq '.blockchain.connectedNodes'

echo "Node 2 peers:"
curl -s http://localhost:8002/api/health | jq '.blockchain.connectedNodes'

echo "Node 3 peers:"
curl -s http://localhost:8003/api/health | jq '.blockchain.connectedNodes'
```

## 📡 **Real-Time Network Updates**

### **WebSocket Testing Across Nodes**

Create `network-websocket-test.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Multi-Node Blockchain Network Monitor</title>
    <style>
        .node { border: 1px solid #ccc; margin: 10px; padding: 10px; }
        .node h3 { margin-top: 0; }
        .messages { height: 200px; overflow-y: scroll; border: 1px solid #eee; padding: 5px; }
    </style>
</head>
<body>
    <h1>Multi-Node Blockchain Network Monitor</h1>
    
    <div class="node">
        <h3>Node 1 (Port 8001)</h3>
        <div id="node1-messages" class="messages"></div>
    </div>
    
    <div class="node">
        <h3>Node 2 (Port 8002)</h3>
        <div id="node2-messages" class="messages"></div>
    </div>
    
    <div class="node">
        <h3>Node 3 (Port 8003)</h3>
        <div id="node3-messages" class="messages"></div>
    </div>
    
    <script>
        // Connect to Node 1
        const ws1 = new WebSocket('ws://localhost:8001');
        const messages1 = document.getElementById('node1-messages');
        
        ws1.onmessage = function(event) {
            const data = JSON.parse(event.data);
            messages1.innerHTML += '<p><strong>' + data.type + ':</strong> ' + JSON.stringify(data.data) + '</p>';
            messages1.scrollTop = messages1.scrollHeight;
        };
        
        // Connect to Node 2
        const ws2 = new WebSocket('ws://localhost:8002');
        const messages2 = document.getElementById('node2-messages');
        
        ws2.onmessage = function(event) {
            const data = JSON.parse(event.data);
            messages2.innerHTML += '<p><strong>' + data.type + ':</strong> ' + JSON.stringify(data.data) + '</p>';
            messages2.scrollTop = messages2.scrollHeight;
        };
        
        // Connect to Node 3
        const ws3 = new WebSocket('ws://localhost:8003');
        const messages3 = document.getElementById('node3-messages');
        
        ws3.onmessage = function(event) {
            const data = JSON.parse(event.data);
            messages3.innerHTML += '<p><strong>' + data.type + ':</strong> ' + JSON.stringify(data.data) + '</p>';
            messages3.scrollTop = messages3.scrollHeight;
        };
    </script>
</body>
</html>
```

## 🔧 **Troubleshooting Network Issues**

### **Common Problems & Solutions**

#### **1. "Connection Refused" Error**
```bash
# Check if node is running
curl http://localhost:8002/api/health

# If not running, start it:
cd "h:\Blockchain\Node 2"
PORT=8002 npm run serve
```

#### **2. Nodes Not Connecting**
```bash
# Verify node URLs are correct
ping localhost

# Check if ports are available
netstat -an | grep 8001
netstat -an | grep 8002

# Windows: netstat -an | findstr 8001
```

#### **3. Synchronization Not Working**
```bash
# Force manual sync
curl http://localhost:8001/api/chainSync
curl http://localhost:8002/api/chainSync

# Check for network connectivity
curl http://localhost:8001/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{"nodes": ["http://localhost:8002"]}'
```

#### **4. Different Chain States**
```bash
# Compare blockchain lengths
curl -s http://localhost:8001/api/stats | jq '.chainLength'
curl -s http://localhost:8002/api/stats | jq '.chainLength'

# If different, sync the shorter chain
curl http://localhost:SHORTER_NODE_PORT/api/chainSync
```

### **Network Debugging Commands**

```bash
# Full network status check
echo "=== Network Health Check ==="
for port in 8001 8002 8003; do
  echo "Node on port $port:"
  curl -s http://localhost:$port/api/health 2>/dev/null | jq '.blockchain // "Not running"' || echo "Not running"
  echo
done

# Port availability check
echo "=== Port Status ==="
for port in 8001 8002 8003; do
  nc -z localhost $port && echo "Port $port: Open" || echo "Port $port: Closed"
done
```

## 🎯 **Network Testing Scenarios**

### **Scenario 1: Basic 2-Node Network**
```bash
# Start 2 nodes
PORT=8001 npm run serve &
PORT=8002 npm run serve &

# Connect them
curl -X POST http://localhost:8001/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{"nodes": ["http://localhost:8002"]}'

# Test synchronization
curl http://localhost:8001/api/chainSync
```

### **Scenario 2: 3-Node Ring Network**
```bash
# Start 3 nodes
PORT=8001 npm run serve &
PORT=8002 npm run serve &
PORT=8003 npm run serve &

# Create ring: 1→2→3→1
curl -X POST http://localhost:8001/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{"nodes": ["http://localhost:8002"]}'

curl -X POST http://localhost:8002/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{"nodes": ["http://localhost:8003"]}'

curl -X POST http://localhost:8003/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{"nodes": ["http://localhost:8001"]}'
```

### **Scenario 3: Node Failure Recovery**
```bash
# Kill Node 2
pkill -f "PORT=8002"

# Check network health
curl http://localhost:8001/api/health
curl http://localhost:8003/api/health

# Restart Node 2
PORT=8002 npm run serve &

# Reconnect
curl -X POST http://localhost:8001/api/nodeConnection \
  -H "Content-Type: application/json" \
  -d '{"nodes": ["http://localhost:8002"]}'
```

## 📋 **Network Validation Checklist**

### **Pre-Network Setup**
- [ ] All required nodes started and responding
- [ ] Each node has unique port assignment
- [ ] Health endpoints accessible on all nodes
- [ ] WebSocket connections working

### **Network Formation**
- [ ] Node connections established successfully
- [ ] Bidirectional connectivity verified
- [ ] Connected node count matches expectations
- [ ] Network topology as planned

### **Network Operations**
- [ ] Chain synchronization working
- [ ] Blockchain state consistency across nodes
- [ ] Real-time updates propagating
- [ ] Error handling for failed connections

### **Performance Monitoring**
- [ ] Response times acceptable across nodes
- [ ] Memory usage stable on all nodes
- [ ] WebSocket connections stable
- [ ] Audit logs capturing network events

## 🎉 **Success Criteria**

Your multi-node blockchain network is working correctly when:

✅ **All nodes are running** and responding to health checks
✅ **Nodes are connected** (connectedNodes > 0 in health response)  
✅ **Chain synchronization works** (chains stay consistent)
✅ **WebSocket updates propagate** across the network
✅ **Network survives node failures** and reconnections
✅ **Real-time monitoring** shows network activity

## 📞 **Next Steps**

With a working multi-node network, you can:

1. **Implement faucet functionality** for initial balance distribution
2. **Add smart contract support** for programmable transactions
3. **Enhance network discovery** for automatic peer finding
4. **Implement transaction broadcasting** across the network
5. **Add consensus improvements** for better conflict resolution

---

**🎯 Your multi-node blockchain network demonstrates enterprise-grade P2P networking capabilities!**

The network formation, synchronization, and real-time communication prove your blockchain can operate in a distributed environment just like Bitcoin, Ethereum, and other production blockchain networks.
