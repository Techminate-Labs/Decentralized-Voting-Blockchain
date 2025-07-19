const crypto = require('crypto');

function calculateHash(previousHash, timestamp, transactions, nonce) {
  return crypto.createHash('sha256').update(previousHash + timestamp + JSON.stringify(transactions) + nonce).digest('hex');
}

function isChainValid(blockchain) {
    // Handle both blockchain object and chain array
    const chain = blockchain.chain || blockchain;
    
    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];
     
      // Validate all transactions in the current block
      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }

      if (currentBlock.hash !== calculateHash(currentBlock.previousHash, currentBlock.timestamp, currentBlock.transactions, currentBlock.nonce)) {
        return false;
      }
      
      // Validate proof of work (check if hash starts with required zeros)
      const difficulty = 2; // Should match blockchain difficulty
      if (currentBlock.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        return false;
      }
    }

    return true;
}

module.exports = {
    isChainValid
};