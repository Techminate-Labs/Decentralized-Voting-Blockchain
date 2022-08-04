const crypto = require('crypto');

class Block {
    /**
     * @param {number} timestamp
     * @param {Transaction[]} transactions
     * @param {string} previousHash
     */
    constructor(timestamp, transactions, previousHash = '') {
      this.previousHash = previousHash;
      this.hash = this.calculateHash();
      this.nonce = 0;
      this.timestamp = timestamp;
      this.transactions = transactions;
    }
  
    /**
     * Returns the SHA256 of this block (by processing all the data stored
     * inside this block)
     *
     * @returns {string}
     */
    calculateHash() {
      return crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
    }
    /**
   * Starts the mining process on the block. It changes the 'nonce' until the hash
   * of the block starts with enough zeros (= difficulty)
   *
   * @param {number} difficulty
   */
  mineBlock(difficulty) {
    // substring(start_index, end_index)
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log('newly mined block :' + this.hash)
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }

}
module.exports = Block;