module.exports = {
  // Mining configuration
  DIFFICULTY: 2,
  MINING_REWARD: 100,
  
  // Transaction limits
  MAX_PENDING_TRANSACTIONS: 100,
  MAX_BLOCK_SIZE: 10,
  MAX_TRANSACTION_AMOUNT: 1000000,
  MIN_TRANSACTION_AMOUNT: 0.01,
  
  // Network configuration
  MAX_NODES: 50,
  SYNC_TIMEOUT: 5000,
  
  // Performance settings
  AUTO_SAVE: true,
  CLEANUP_INTERVAL: 60000, // 1 minute
  
  // Security settings
  RATE_LIMIT: {
    TRANSACTION: { max: 5, window: 60000 },
    MINING: { max: 2, window: 60000 },
    NODE_CONNECTION: { max: 3, window: 60000 }
  }
};
