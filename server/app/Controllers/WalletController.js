const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

const asyncHandler = require('express-async-handler')

const generateKeys = asyncHandler(
    async (req, res) => {
        const key = ec.genKeyPair();
        const publicKey = key.getPublic('hex');
        const privateKey = key.getPrivate('hex');

        let keyPair = {
            'Public key' : publicKey,
            'Private key' : privateKey
        } 
        res.status(200).json(keyPair)
    }
)

module.exports = {
    generateKeys
}
