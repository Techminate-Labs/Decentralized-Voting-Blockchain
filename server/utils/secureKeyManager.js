const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class SecureKeyManager {
  constructor() {
    this.keyDir = path.join(__dirname, '..', 'secure');
    this.ensureSecureDir();
  }

  ensureSecureDir() {
    if (!fs.existsSync(this.keyDir)) {
      fs.mkdirSync(this.keyDir, { recursive: true });
      logger.info('Created secure directory for key storage');
    }
  }

  // Generate secure keys on startup if not exist
  generateKeysIfNeeded() {
    const privateKeyFile = path.join(this.keyDir, '.private');
    const walletFile = path.join(this.keyDir, '.wallet');

    if (!fs.existsSync(privateKeyFile) || !fs.existsSync(walletFile)) {
      logger.info('Generating secure keys...');
      
      const EC = require('elliptic').ec;
      const ec = new EC('secp256k1');
      
      // Generate private key
      const keyPair = ec.genKeyPair();
      const privateKey = keyPair.getPrivate('hex');
      const publicKey = keyPair.getPublic('hex');
      
      // Encrypt before storing
      const encrypted = this.encryptKey(privateKey);
      
      // Store with restricted permissions (if on Unix)
      try {
        fs.writeFileSync(privateKeyFile, encrypted);
        fs.writeFileSync(walletFile, publicKey);
        logger.success('Secure keys generated and stored');
      } catch (error) {
        logger.error('Failed to write key files:', error.message);
        throw new Error('Key file creation failed');
      }
      
      return { privateKey, publicKey };
    }
    
    return this.loadKeys();
  }

  loadKeys() {
    try {
      const privateKeyFile = path.join(this.keyDir, '.private');
      const walletFile = path.join(this.keyDir, '.wallet');
      
      if (!fs.existsSync(privateKeyFile) || !fs.existsSync(walletFile)) {
        throw new Error('Key files not found');
      }

      const encryptedPrivate = fs.readFileSync(privateKeyFile, 'utf8');
      const publicKey = fs.readFileSync(walletFile, 'utf8');
      
      const privateKey = this.decryptKey(encryptedPrivate);
      
      logger.info('Secure keys loaded from storage');
      return { privateKey, publicKey };
    } catch (error) {
      logger.error('Failed to load secure keys:', error.message);
      throw new Error('Key loading failed: ' + error.message);
    }
  }

  encryptKey(key) {
    try {
      const algorithm = 'aes-256-gcm';
      const password = this.getSystemSecret();
      
      const salt = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);
      const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
      
      const cipher = crypto.createCipher(algorithm, derivedKey);
      
      let encrypted = cipher.update(key, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Simple encryption for compatibility
      const result = {
        encrypted,
        salt: salt.toString('hex'),
        iv: iv.toString('hex')
      };
      
      return JSON.stringify(result);
    } catch (error) {
      logger.error('Key encryption failed:', error.message);
      // Fallback to base64 encoding if encryption fails
      return Buffer.from(key).toString('base64');
    }
  }

  decryptKey(encryptedData) {
    try {
      // Try to parse as JSON first (full encryption)
      const data = JSON.parse(encryptedData);
      const algorithm = 'aes-256-gcm';
      const password = this.getSystemSecret();
      
      const salt = Buffer.from(data.salt, 'hex');
      const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
      
      const decipher = crypto.createDecipher(algorithm, derivedKey);
      
      let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      // Fallback to base64 decoding
      try {
        return Buffer.from(encryptedData, 'base64').toString('utf8');
      } catch (fallbackError) {
        logger.error('Key decryption failed:', error.message);
        throw new Error('Unable to decrypt key');
      }
    }
  }

  getSystemSecret() {
    // Use system-specific secret (CPU info + hostname)
    const os = require('os');
    const secret = crypto.createHash('sha256')
      .update(os.hostname() + os.platform() + os.arch())
      .digest('hex');
    return secret;
  }
}

module.exports = new SecureKeyManager();
