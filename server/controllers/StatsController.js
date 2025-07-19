const asyncHandler = require('express-async-handler');

let myChain; // Will be imported from main controller

const getBlockchainStats = asyncHandler(async (req, res) => {
  if (!myChain) {
    return res.status(500).json({ error: 'Blockchain not initialized' });
  }

  const stats = {
    // Basic stats
    chainLength: myChain.chain.length,
    totalTransactions: myChain.chain.reduce((sum, block) => sum + block.transactions.length, 0),
    pendingTransactions: myChain.pendingTransactions.length,
    connectedNodes: myChain.nodes.length,
    difficulty: myChain.difficulty,
    miningReward: myChain.miningReward,
    
    // Advanced stats
    averageBlockTime: calculateAverageBlockTime(myChain.chain),
    totalSupply: calculateTotalSupply(myChain.chain),
    hashRate: estimateHashRate(myChain.chain),
    
    // Network health
    lastBlockTime: myChain.getLatestBlock().timestamp,
    isChainValid: require('../app/Blockchain/Validation').isChainValid(myChain),
    
    timestamp: new Date().toISOString()
  };

  res.status(200).json(stats);
});

const getTransactionHistory = asyncHandler(async (req, res) => {
  const { address } = req.params;
  
  if (!address) {
    return res.status(400).json({ error: 'Address parameter required' });
  }

  const transactions = [];
  
  for (const block of myChain.chain) {
    for (const tx of block.transactions) {
      if (tx.fromAddress === address || tx.toAddress === address) {
        transactions.push({
          blockIndex: myChain.chain.indexOf(block),
          timestamp: tx.timestamp,
          from: tx.fromAddress,
          to: tx.toAddress,
          amount: tx.amount,
          type: tx.fromAddress === address ? 'sent' : 'received'
        });
      }
    }
  }

  res.status(200).json({
    address,
    transactionCount: transactions.length,
    transactions: transactions.reverse() // Latest first
  });
});

// Helper functions
const calculateAverageBlockTime = (chain) => {
  if (chain.length < 2) return 0;
  
  let totalTime = 0;
  for (let i = 1; i < chain.length; i++) {
    totalTime += chain[i].timestamp - chain[i-1].timestamp;
  }
  
  return Math.round(totalTime / (chain.length - 1));
};

const calculateTotalSupply = (chain) => {
  let supply = 0;
  for (const block of chain) {
    for (const tx of block.transactions) {
      if (tx.fromAddress === null) { // Mining reward
        supply += tx.amount;
      }
    }
  }
  return supply;
};

const estimateHashRate = (chain) => {
  if (chain.length < 2) return 0;
  
  const recentBlocks = chain.slice(-10); // Last 10 blocks
  let totalNonces = 0;
  let totalTime = 0;
  
  for (let i = 1; i < recentBlocks.length; i++) {
    totalNonces += recentBlocks[i].nonce;
    totalTime += recentBlocks[i].timestamp - recentBlocks[i-1].timestamp;
  }
  
  return totalTime > 0 ? Math.round(totalNonces / (totalTime / 1000)) : 0;
};

// Export function to set blockchain reference
const setBlockchain = (blockchain) => {
  myChain = blockchain;
};

module.exports = {
  getBlockchainStats,
  getTransactionHistory,
  setBlockchain
};
