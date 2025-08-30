// Test validation fix
const { isChainValid } = require('./server/app/Blockchain/Validation');

// Test with mock blockchain data (plain objects like from network)
const testChain = [
    {
        previousHash: "0",
        hash: "genesis_hash",
        transactions: [],
        nonce: 0,
        timestamp: Date.now()
    },
    {
        previousHash: "genesis_hash",
        hash: "003f57952f952e82a03a71cdbafca755dda3bf7d63b18044924d2d612e2d58e0",
        nonce: 246,
        timestamp: Date.now(),
        transactions: [
            {
                fromAddress: null,
                toAddress: "04e2345433a9fed1c644c0099f9cc03ee6ad438e847251fda6c8e236e3c49f577d1697baa40e4f3473c9da8e359a95ef0ba98848028558caf558a4d3ba8a16d3a8",
                amount: 100,
                signature: ""
            }
        ]
    }
];

console.log('Testing validation fix...');
try {
    const result = isChainValid(testChain);
    console.log('✅ Validation fix works! Result:', result);
} catch (error) {
    console.log('❌ Validation fix failed:', error.message);
}
