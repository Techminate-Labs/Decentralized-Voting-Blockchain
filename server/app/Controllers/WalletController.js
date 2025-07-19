const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // Changed to match other files

const asyncHandler = require('express-async-handler')
const auditLogger = require('../../utils/auditLogger');

const generateKeys = asyncHandler(
    async (req, res) => {
        const key = ec.genKeyPair();
        const publicKey = key.getPublic('hex');
        const privateKey = key.getPrivate('hex');

        // Security: Audit key generation
        auditLogger.log('KEY_GENERATION', {
            publicKey: publicKey,
            timestamp: Date.now(),
            userAgent: req.get('User-Agent')
        }, req.ip);

        let keyPair = {
            'Public key' : publicKey,
            'Private key' : privateKey,
            'warning': 'Store private key securely - never share it'
        } 
        res.status(200).json(keyPair)
    }
)

module.exports = {
    generateKeys
}
