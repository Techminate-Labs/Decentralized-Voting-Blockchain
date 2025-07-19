const fs = require('fs');
const path = require('path');

const BLOCKCHAIN_FILE = path.join(__dirname, '..', 'data', 'blockchain.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(BLOCKCHAIN_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const saveBlockchain = (blockchain) => {
  try {
    ensureDataDir();
    const data = {
      chain: blockchain.chain,
      pendingTransactions: blockchain.pendingTransactions,
      nodes: blockchain.nodes,
      difficulty: blockchain.difficulty,
      miningReward: blockchain.miningReward,
      timestamp: Date.now()
    };
    fs.writeFileSync(BLOCKCHAIN_FILE, JSON.stringify(data, null, 2));
    console.log('Blockchain saved to disk');
    return true;
  } catch (error) {
    console.error('Failed to save blockchain:', error.message);
    return false;
  }
};

const loadBlockchain = () => {
  try {
    if (fs.existsSync(BLOCKCHAIN_FILE)) {
      const data = JSON.parse(fs.readFileSync(BLOCKCHAIN_FILE, 'utf8'));
      console.log('Blockchain loaded from disk');
      return data;
    }
  } catch (error) {
    console.error('Failed to load blockchain:', error.message);
  }
  return null;
};

module.exports = {
  saveBlockchain,
  loadBlockchain
};
