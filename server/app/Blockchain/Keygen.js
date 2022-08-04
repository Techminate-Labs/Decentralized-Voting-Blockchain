const EdDSA = require('elliptic').eddsa
const ec = new EdDSA('ed25519')

// Generate random hex number
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

// Generate a new key pair and convert them to hex-strings
const privateKey = genRanHex(64);
const keyPair = ec.keyFromSecret(privateKey);
const publicKey = keyPair.getPublic('hex');

// Print the keys to the console
console.log('Public key: \n', publicKey);

console.log('Private key\n', privateKey);