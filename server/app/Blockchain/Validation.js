const crypto = require('crypto');

function calculateHash(previousHash, timestamp, transactions, nonce) {
  return crypto.createHash('sha256').update(previousHash + timestamp + JSON.stringify(transactions) + nonce).digest('hex');
}

function isChainValid(chain) {
    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];
     
      // console.log(calculateHash(currentBlock.previousHash, currentBlock.timestamp, currentBlock.transactions, currentBlock.nonce))
      
      // transactions of the current block
      // if (!currentBlock.hasValidTransactions()) {
      //   return false;
      // }

      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }

      if (currentBlock.hash !== calculateHash(currentBlock.previousHash, currentBlock.timestamp, currentBlock.transactions, currentBlock.nonce)) {
        return false;
      }
    }

    return true;
  }

  module.exports = {
      isChainValid
  };