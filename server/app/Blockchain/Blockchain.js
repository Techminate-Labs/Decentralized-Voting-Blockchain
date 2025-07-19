const Block = require('./Block');
const Transaction = require('./Transaction');
const { isChainValid } = require('./Validation');
const { saveBlockchain, loadBlockchain } = require('../../utils/persistence');
const fetch = require('node-fetch');
const config = require('../../config/blockchain');

class Blockchain {
  constructor() {
    // Try to load existing blockchain
    const savedData = loadBlockchain();
    if (savedData) {
      this.chain = savedData.chain || [this.createGenesisBlock()];
      this.pendingTransactions = savedData.pendingTransactions || [];
      this.nodes = savedData.nodes || [];
      this.difficulty = savedData.difficulty || config.DIFFICULTY;
      this.miningReward = savedData.miningReward || config.MINING_REWARD;
    } else {
      this.chain = [this.createGenesisBlock()];
      this.difficulty = config.DIFFICULTY;
      this.pendingTransactions = [];
      this.miningReward = config.MINING_REWARD;
      this.nodes = [];
    }
    
    // Use configuration limits
    this.maxPendingTransactions = config.MAX_PENDING_TRANSACTIONS;
    this.maxBlockSize = config.MAX_BLOCK_SIZE;
  }

  /**
   * @returns {Block}
   */
  createGenesisBlock() {
    return new Block(Date.now(), [], '0');
  }

  /**
   * Returns the latest block on our chain. Useful when you want to create a
   * new Block and you need the hash of the previous Block.
   *
   * @returns {Block[]}
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Returns the list of blocks in the chain
   *
   */
  getChain() {
    return {
      'length': this.chain.length,
      'blockchain' : this.chain
    };
  }

  /**
   * creates a new block 
   * includes the block to the chain
   *
   */

  // addBlock(newBlock){
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   newBlock.hash = newBlock.calculateHash();
  //   newBlock.mineBlock(this.difficulty)
  //   this.chain.push(newBlock);
  // }

  minePendingTransactions(miningRewardAddress) {
    if (this.pendingTransactions.length === 0) {
      return 'No pending transactions to mine';
    }

    // Limit transactions per block
    const transactionsToMine = this.pendingTransactions.splice(0, this.maxBlockSize);

    const txsMiningReward = new Transaction(null, miningRewardAddress, this.miningReward);
    transactionsToMine.push(txsMiningReward);

    const block = new Block(Date.now(), transactionsToMine, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    // Auto-save after mining
    saveBlockchain(this);

    return 'Block successfully mined!';
  }

  addTransaction(txs) {
    if (!txs.fromAddress || !txs.toAddress) {
      throw new Error('Transaction must include from and to address');
    }

    // Verify the transaction
    if (!txs.isValid()) {
      throw new Error('Cannot add invalid transaction to chain');
    }

    // Prevent duplicate transactions
    const duplicate = this.pendingTransactions.find(pendingTx => 
      pendingTx.fromAddress === txs.fromAddress &&
      pendingTx.toAddress === txs.toAddress &&
      pendingTx.amount === txs.amount &&
      Math.abs(pendingTx.timestamp - txs.timestamp) < 1000 // Within 1 second
    );

    if (duplicate) {
      throw new Error('Duplicate transaction detected');
    }

    // Limit pending transactions
    if (this.pendingTransactions.length >= this.maxPendingTransactions) {
      throw new Error('Too many pending transactions. Try again later.');
    }

    this.pendingTransactions.push(txs);
    
    // Auto-save after adding transaction
    saveBlockchain(this);
  }

  // Add transaction fee calculation
  calculateTransactionFee(amount) {
    return Math.max(0.01, amount * 0.001); // Minimum 0.01 or 0.1% of amount
  }

  addNodes(address) {
    if (!this.nodes.includes(address)) {
      this.nodes.push(address);
      // Auto-save after adding node
      saveBlockchain(this);
    }
  }

  isChainValid() {
    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      //Validate previous block
      //if the previousHash prop of a block is the same if we recalculate the hash of previous block
      // console.log('recalculated hash : ' + previousBlock.calculateHash())
      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      //Validate current block
      // if the hash of current block is the same if we recalcualte the hash of current block
      // console.log('recalculated hash : ' + currentBlock.calculateHash())
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const txs of block.transactions) {
        if (txs.fromAddress === address) {
          balance -= txs.amount;
        }

        if (txs.toAddress === address) {
          balance += txs.amount;
        }
      }
    }

    console.log('getBalanceOfAdrees:', balance);
    return balance;
  }

  getPendingTxs() {
    return this.pendingTransactions;
  }

  addNodes(address) {
    this.nodes.push(address)
  }

  async synChain(){
    if (this.nodes.length > 0) {
      console.log('Starting chain synchronization...')
      // Removed setInterval to prevent infinite loops
      await this.replaceChain();
    }
  }

  async replaceChain() {
    const network = this.nodes
    let longestChain = null
    let maxLength = this.chain.length

    if (network.length > 0) {
      for (let i = 0; i < network.length; i++) {
        try {
          console.log(`Checking node: ${network[i]}`)
          const response = await fetch(`${network[i]}/api/chainList`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000
          });
          
          if (response.status === 200) {
            const data = await response.json();
            const length = data.length
            const chainList = data.blockchain
            
            console.log(`Chain length from node ${network[i]}: ${length}`)
            if (length > maxLength && isChainValid(chainList)){
              maxLength = length
              longestChain = chainList
              console.log(`Found longer valid chain with length: ${length}`)
            } else if (length > maxLength) {
              console.log(`Chain from node ${network[i]} is longer but invalid`)
            }
          } else {
            console.log(`Node ${network[i]} returned status: ${response.status}`)
          }
        } catch (error) {
          console.log(`Failed to connect to node ${network[i]}: ${error.message}`);
        }
      }
      
      if (longestChain != null){
        this.chain = longestChain
        console.log('Chain successfully replaced with longer valid chain')
        // Auto-save after chain replacement
        saveBlockchain(this);
        return 'Chain synchronization completed!'
      }
      return 'No longer valid chain found'
    } else {
      return 'Connect to network first!'
    }
  }
}

module.exports = Blockchain;