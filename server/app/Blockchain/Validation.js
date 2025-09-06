const crypto = require('crypto');
const CryptoManager = require('../../utils/cryptoManager');

function calculateHash(previousHash, timestamp, transactions, nonce) {
  return crypto.createHash('sha256').update(previousHash + timestamp + JSON.stringify(transactions) + nonce).digest('hex');
}

async function isChainValid(blockchain) {
    // Handle both blockchain object and chain array
    const chain = blockchain.chain || blockchain;
    const cryptoManager = new CryptoManager();
    
    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];
     
      // Validate all transactions in the current block
      if (currentBlock.transactions && currentBlock.transactions.length > 0) {
        for (const tx of currentBlock.transactions) {
          // Basic transaction validation for plain objects
          if (tx.amount < 0) return false;
          // Allow mining reward transactions (fromAddress is null)
          if (tx.fromAddress && !tx.signature) return false; // Signed tx must have signature
          // Validate transaction structure
          if (!tx.toAddress) return false;
          if (typeof tx.amount !== 'number') return false;
          
          // Validate cryptographic signatures for signed transactions
          if (tx.fromAddress && tx.signature) {
            const curve = tx.curve || cryptoManager.detectCurveType(tx.fromAddress);
            if (!curve) {
              console.warn(`Could not detect curve type for transaction ${tx.fromAddress}`);
              continue; // Skip validation for unknown curve
            }
            
            const txHash = crypto.createHash('sha256')
              .update(tx.fromAddress + tx.toAddress + tx.amount + tx.timestamp)
              .digest('hex');
            
            try {
              const isValidSig = await cryptoManager.verifySignature(
                txHash, 
                tx.signature, 
                tx.fromAddress, 
                curve
              );
              
              if (!isValidSig) {
                console.error(`Invalid signature for transaction from ${tx.fromAddress}`);
                return false;
              }
            } catch (error) {
              console.error(`Signature verification failed: ${error.message}`);
              return false;
            }
          }
        }
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

// Synchronous version for backward compatibility
function isChainValidSync(blockchain) {
    // Handle both blockchain object and chain array
    const chain = blockchain.chain || blockchain;
    
    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];
     
      // Basic validation without cryptographic signature verification
      if (currentBlock.transactions && currentBlock.transactions.length > 0) {
        for (const tx of currentBlock.transactions) {
          if (tx.amount < 0) return false;
          if (tx.fromAddress && !tx.signature) return false;
          if (!tx.toAddress) return false;
          if (typeof tx.amount !== 'number') return false;
        }
      }

      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }

      if (currentBlock.hash !== calculateHash(currentBlock.previousHash, currentBlock.timestamp, currentBlock.transactions, currentBlock.nonce)) {
        return false;
      }
      
      // Validate proof of work
      const difficulty = 2;
      if (currentBlock.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        return false;
      }
    }

    return true;
}

module.exports = {
    isChainValid,
    isChainValidSync
};