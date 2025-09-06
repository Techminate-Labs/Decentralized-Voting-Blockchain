const CryptoManager = require('../../utils/cryptoManager');
const asyncHandler = require('express-async-handler');
const auditLogger = require('../../utils/auditLogger');

const generateKeys = asyncHandler(
    async (req, res) => {
        try {
            const curve = req.query.curve || 'ed25519'; // Default to Ed25519
            const cryptoManager = new CryptoManager();
            
            // Validate curve parameter
            if (!['ed25519', 'secp256k1'].includes(curve)) {
                return res.status(400).json({
                    error: 'Invalid curve type. Use "ed25519" or "secp256k1"'
                });
            }
            
            const keyPair = await cryptoManager.generateKeyPair(curve);

            // Security: Audit key generation
            auditLogger.log('KEY_GENERATION', {
                publicKey: keyPair.publicKey,
                curve: keyPair.curve,
                timestamp: Date.now(),
                userAgent: req.get('User-Agent')
            }, req.ip);

            const response = {
                'Public key': keyPair.publicKey,
                'Private key': keyPair.privateKey,
                'curve': keyPair.curve,
                'keyLength': {
                    'publicKey': keyPair.publicKey.length,
                    'privateKey': keyPair.privateKey.length
                },
                'warning': 'Store private key securely - never share it',
                'info': curve === 'ed25519' ? 
                    'Ed25519: High-performance, secure signatures' : 
                    'secp256k1: Bitcoin-compatible signatures'
            };
            
            res.status(200).json(response);
        } catch (error) {
            console.error('Key generation error:', error.message);
            res.status(500).json({
                error: 'Failed to generate keys',
                details: error.message
            });
        }
    }
);

// New endpoint to get supported curves
const getSupportedCurves = asyncHandler(
    async (req, res) => {
        res.status(200).json({
            supportedCurves: ['ed25519', 'secp256k1'],
            default: 'ed25519',
            recommendations: {
                'ed25519': {
                    description: 'High-performance, secure, modern signature system',
                    keySize: '32 bytes',
                    signatureSize: '64 bytes',
                    performance: 'Excellent',
                    security: '128-bit equivalent',
                    recommended: true
                },
                'secp256k1': {
                    description: 'Bitcoin-compatible elliptic curve',
                    keySize: '32 bytes private, 33/65 bytes public',
                    signatureSize: '70-73 bytes',
                    performance: 'Good',
                    security: '~110-bit equivalent',
                    recommended: false,
                    note: 'Use for Bitcoin compatibility only'
                }
            }
        });
    }
);

module.exports = {
    generateKeys,
    getSupportedCurves
};
