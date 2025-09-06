const crypto = require('crypto');
const ed25519 = require('@noble/ed25519');
const EC = require('elliptic').ec;

// Set the required hash function for @noble/ed25519
ed25519.etc.sha512Sync = (...m) => crypto.createHash('sha512').update(Buffer.concat(m)).digest();

// Crypto Manager - supports both Ed25519 and secp256k1
class CryptoManager {
  constructor() {
    this.ec = new EC('secp256k1');
    this.defaultCurve = 'ed25519'; // Changed to Ed25519 as default
  }

  /**
   * Generate a new key pair
   * @param {string} curve - 'ed25519' or 'secp256k1'
   * @returns {Object} { publicKey, privateKey, curve }
   */
  async generateKeyPair(curve = this.defaultCurve) {
    if (curve === 'ed25519') {
      const privateKey = crypto.randomBytes(32);
      const publicKey = await ed25519.getPublicKey(privateKey);
      
      return {
        publicKey: Buffer.from(publicKey).toString('hex'),
        privateKey: Buffer.from(privateKey).toString('hex'),
        curve: 'ed25519'
      };
    } else if (curve === 'secp256k1') {
      const keyPair = this.ec.genKeyPair();
      return {
        publicKey: keyPair.getPublic('hex'),
        privateKey: keyPair.getPrivate('hex'),
        curve: 'secp256k1'
      };
    } else {
      throw new Error('Unsupported curve. Use "ed25519" or "secp256k1"');
    }
  }

  /**
   * Sign a message hash
   * @param {string} messageHash - The hash to sign
   * @param {string} privateKey - Private key in hex
   * @param {string} curve - Curve type
   * @returns {string} Signature in hex
   */
  async signMessage(messageHash, privateKey, curve) {
    if (curve === 'ed25519') {
      const privKeyBytes = Buffer.from(privateKey, 'hex');
      const messageBytes = Buffer.from(messageHash, 'hex');
      const signature = await ed25519.sign(messageBytes, privKeyBytes);
      return Buffer.from(signature).toString('hex');
    } else if (curve === 'secp256k1') {
      const keyPair = this.ec.keyFromPrivate(privateKey, 'hex');
      const signature = keyPair.sign(messageHash, 'base64');
      return signature.toDER('hex');
    } else {
      throw new Error('Unsupported curve for signing');
    }
  }

  /**
   * Verify a signature
   * @param {string} messageHash - The original hash
   * @param {string} signature - Signature in hex
   * @param {string} publicKey - Public key in hex
   * @param {string} curve - Curve type
   * @returns {boolean} True if signature is valid
   */
  async verifySignature(messageHash, signature, publicKey, curve) {
    try {
      if (curve === 'ed25519') {
        const pubKeyBytes = Buffer.from(publicKey, 'hex');
        const sigBytes = Buffer.from(signature, 'hex');
        const messageBytes = Buffer.from(messageHash, 'hex');
        return await ed25519.verify(sigBytes, messageBytes, pubKeyBytes);
      } else if (curve === 'secp256k1') {
        const keyPair = this.ec.keyFromPublic(publicKey, 'hex');
        return keyPair.verify(messageHash, signature);
      } else {
        throw new Error('Unsupported curve for verification');
      }
    } catch (error) {
      console.error('Signature verification error:', error.message);
      return false;
    }
  }

  /**
   * Detect curve type from key format
   * @param {string} publicKey - Public key in hex
   * @returns {string} Detected curve type
   */
  detectCurveType(publicKey) {
    if (!publicKey) return null;
    
    // Ed25519 public keys are 32 bytes (64 hex chars)
    if (publicKey.length === 64) {
      return 'ed25519';
    }
    // secp256k1 compressed public keys are 33 bytes (66 hex chars)
    // secp256k1 uncompressed public keys are 65 bytes (130 hex chars) 
    else if (publicKey.length === 66 || publicKey.length === 130) {
      return 'secp256k1';
    }
    
    return null;
  }

  /**
   * Convert secp256k1 key to compressed format
   * @param {string} publicKey - secp256k1 public key
   * @returns {string} Compressed public key
   */
  compressSecp256k1Key(publicKey) {
    if (publicKey.length === 66) {
      return publicKey; // Already compressed
    }
    
    try {
      const keyPair = this.ec.keyFromPublic(publicKey, 'hex');
      return keyPair.getPublic(true, 'hex'); // Compressed format
    } catch (error) {
      return publicKey; // Return original if compression fails
    }
  }

  /**
   * Generate a secure hash (SHA-256)
   * @param {string} data - Data to hash
   * @returns {string} Hash in hex
   */
  hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Validate key format
   * @param {string} key - Key to validate
   * @param {string} type - 'public' or 'private'
   * @param {string} curve - Curve type
   * @returns {boolean} True if valid format
   */
  validateKeyFormat(key, type, curve) {
    if (!key || typeof key !== 'string') return false;

    if (curve === 'ed25519') {
      // Ed25519 keys are always 32 bytes (64 hex chars)
      return key.length === 64 && /^[a-fA-F0-9]{64}$/.test(key);
    } else if (curve === 'secp256k1') {
      if (type === 'private') {
        // secp256k1 private keys are 32 bytes (64 hex chars)
        return key.length === 64 && /^[a-fA-F0-9]{64}$/.test(key);
      } else if (type === 'public') {
        // secp256k1 public keys can be compressed (66) or uncompressed (130)
        return (key.length === 66 || key.length === 130) && 
               /^[a-fA-F0-9]+$/.test(key);
      }
    }
    
    return false;
  }
}

module.exports = CryptoManager;
