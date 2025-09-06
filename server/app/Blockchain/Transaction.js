const crypto = require('crypto');
const CryptoManager = require('../../utils/cryptoManager');

class Transaction {
    constructor(fromAddress, toAddress, amount, curve = null) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
        this.signature = '';
        
        // Auto-detect curve type from public key if not specified
        this.curve = curve || this.detectCurveFromAddress(fromAddress);
        this.cryptoManager = new CryptoManager();
    }

    /**
     * Detect curve type from address format
     * @param {string} address - The wallet address (public key)
     * @returns {string} Detected curve type
     */
    detectCurveFromAddress(address) {
        if (!address) return 'ed25519'; // Default for mining rewards
        return this.cryptoManager.detectCurveType(address) || 'ed25519';
    }

     /**
   * Creates a SHA256 hash of the transaction
   *
   * @returns {string}
   */
  calculateHash() {
    return crypto.createHash('sha256').update(this.fromAddress + this.toAddress + this.amount + this.timestamp).digest('hex');
  }

  /**
   * Signs a transaction with the given signing key
   * Supports both Ed25519 and secp256k1 keys
   *
   * @param {Object} keyData - { privateKey, publicKey, curve }
   */
  async signTransaction(keyData) {
    // Extract key information
    let privateKey, publicKey, curve;
    
    if (typeof keyData === 'object' && keyData.getPublic) {
      // Legacy elliptic keyPair object support
      publicKey = keyData.getPublic('hex');
      privateKey = keyData.getPrivate('hex');
      curve = 'secp256k1';
    } else if (typeof keyData === 'object') {
      // New format: { privateKey, publicKey, curve }
      ({ privateKey, publicKey, curve } = keyData);
    } else {
      throw new Error('Invalid key data format');
    }

    // Validate that fromAddress matches the public key
    if (publicKey !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!');
    }
    
    // Update transaction curve if not set
    if (!this.curve) {
      this.curve = curve;
    }
    
    // Calculate the hash and sign
    const hashTx = this.calculateHash();
    this.signature = await this.cryptoManager.signMessage(hashTx, privateKey, curve);
  }

  /**
   * Verify transaction signature
   * @returns {boolean} True if signature is valid
   */
  async isValid() {
    // If the transaction doesn't have a from address we assume it's a mining reward
    if (this.fromAddress === null) return true;

    // Check signature exists
    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    // Auto-detect curve if not set
    if (!this.curve) {
      this.curve = this.detectCurveFromAddress(this.fromAddress);
    }

    const hashTx = this.calculateHash();
    
    try {
      return await this.cryptoManager.verifySignature(
        hashTx, 
        this.signature, 
        this.fromAddress, 
        this.curve
      );
    } catch (error) {
      console.error('Transaction validation error:', error.message);
      return false;
    }
  }

  /**
   * Get transaction info including curve type
   * @returns {Object} Transaction information
   */
  getInfo() {
    return {
      from: this.fromAddress,
      to: this.toAddress,
      amount: this.amount,
      timestamp: this.timestamp,
      curve: this.curve,
      signature: this.signature ? this.signature.substring(0, 16) + '...' : 'unsigned'
    };
  }
}

module.exports = Transaction;