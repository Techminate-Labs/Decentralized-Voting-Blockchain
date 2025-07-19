const WebSocket = require('ws');

class BlockchainWebSocket {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();
    
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log('New WebSocket client connected');
      
      ws.on('close', () => {
        this.clients.delete(ws);
        console.log('WebSocket client disconnected');
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
      
      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to blockchain node',
        timestamp: new Date().toISOString()
      }));
    });
  }
  
  broadcast(type, data) {
    const message = JSON.stringify({
      type,
      data,
      timestamp: new Date().toISOString()
    });
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  notifyNewTransaction(transaction) {
    this.broadcast('new_transaction', transaction);
  }
  
  notifyNewBlock(block) {
    this.broadcast('new_block', {
      index: block.index,
      hash: block.hash,
      transactions: block.transactions.length,
      timestamp: block.timestamp
    });
  }
  
  notifyChainSync(message) {
    this.broadcast('chain_sync', { message });
  }
}

module.exports = BlockchainWebSocket;
