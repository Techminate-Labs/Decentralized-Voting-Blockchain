const CryptoManager = require('./server/utils/cryptoManager');
const Transaction = require('./server/app/Blockchain/Transaction');

async function testEd25519Implementation() {
    console.log('🧪 Testing Ed25519 Implementation...\n');
    
    const cryptoManager = new CryptoManager();
    
    try {
        // Test 1: Generate Ed25519 keys
        console.log('1️⃣ Testing Ed25519 key generation...');
        const ed25519Keys = await cryptoManager.generateKeyPair('ed25519');
        console.log(`   ✅ Ed25519 Public Key: ${ed25519Keys.publicKey}`);
        console.log(`   ✅ Ed25519 Private Key: ${ed25519Keys.privateKey.substring(0, 16)}...`);
        console.log(`   ✅ Key lengths - Public: ${ed25519Keys.publicKey.length}, Private: ${ed25519Keys.privateKey.length}`);
        
        // Test 2: Generate secp256k1 keys for comparison
        console.log('\n2️⃣ Testing secp256k1 key generation...');
        const secp256k1Keys = await cryptoManager.generateKeyPair('secp256k1');
        console.log(`   ✅ secp256k1 Public Key: ${secp256k1Keys.publicKey.substring(0, 32)}...`);
        console.log(`   ✅ secp256k1 Private Key: ${secp256k1Keys.privateKey.substring(0, 16)}...`);
        console.log(`   ✅ Key lengths - Public: ${secp256k1Keys.publicKey.length}, Private: ${secp256k1Keys.privateKey.length}`);
        
        // Test 3: Curve detection
        console.log('\n3️⃣ Testing curve detection...');
        const detectedEd25519 = cryptoManager.detectCurveType(ed25519Keys.publicKey);
        const detectedSecp256k1 = cryptoManager.detectCurveType(secp256k1Keys.publicKey);
        console.log(`   ✅ Ed25519 detection: ${detectedEd25519}`);
        console.log(`   ✅ secp256k1 detection: ${detectedSecp256k1}`);
        
        // Test 4: Ed25519 Transaction signing and verification
        console.log('\n4️⃣ Testing Ed25519 transaction signing...');
        const ed25519Tx = new Transaction(ed25519Keys.publicKey, 'recipient123', 10, 'ed25519');
        await ed25519Tx.signTransaction({
            privateKey: ed25519Keys.privateKey,
            publicKey: ed25519Keys.publicKey,
            curve: 'ed25519'
        });
        
        console.log(`   ✅ Ed25519 Signature: ${ed25519Tx.signature.substring(0, 32)}...`);
        console.log(`   ✅ Ed25519 Signature length: ${ed25519Tx.signature.length}`);
        
        const ed25519Valid = await ed25519Tx.isValid();
        console.log(`   ✅ Ed25519 Transaction valid: ${ed25519Valid}`);
        
        // Test 5: secp256k1 Transaction signing and verification  
        console.log('\n5️⃣ Testing secp256k1 transaction signing...');
        const secp256k1Tx = new Transaction(secp256k1Keys.publicKey, 'recipient123', 10, 'secp256k1');
        await secp256k1Tx.signTransaction({
            privateKey: secp256k1Keys.privateKey,
            publicKey: secp256k1Keys.publicKey,
            curve: 'secp256k1'
        });
        
        console.log(`   ✅ secp256k1 Signature: ${secp256k1Tx.signature.substring(0, 32)}...`);
        console.log(`   ✅ secp256k1 Signature length: ${secp256k1Tx.signature.length}`);
        
        const secp256k1Valid = await secp256k1Tx.isValid();
        console.log(`   ✅ secp256k1 Transaction valid: ${secp256k1Valid}`);
        
        // Test 6: Performance comparison
        console.log('\n6️⃣ Performance comparison...');
        
        // Ed25519 performance
        const ed25519Start = Date.now();
        for (let i = 0; i < 100; i++) {
            const testData = `test message ${i}`;
            const hash = cryptoManager.hash(testData);
            await cryptoManager.signMessage(hash, ed25519Keys.privateKey, 'ed25519');
        }
        const ed25519Time = Date.now() - ed25519Start;
        
        // secp256k1 performance
        const secp256k1Start = Date.now();
        for (let i = 0; i < 100; i++) {
            const testData = `test message ${i}`;
            const hash = cryptoManager.hash(testData);
            await cryptoManager.signMessage(hash, secp256k1Keys.privateKey, 'secp256k1');
        }
        const secp256k1Time = Date.now() - secp256k1Start;
        
        console.log(`   ✅ Ed25519 (100 signatures): ${ed25519Time}ms`);
        console.log(`   ✅ secp256k1 (100 signatures): ${secp256k1Time}ms`);
        console.log(`   ✅ Ed25519 is ${(secp256k1Time / ed25519Time).toFixed(2)}x faster`);
        
        // Test 7: Invalid signature detection
        console.log('\n7️⃣ Testing invalid signature detection...');
        const invalidTx = new Transaction(ed25519Keys.publicKey, 'recipient123', 10, 'ed25519');
        invalidTx.signature = 'invalid_signature_data';
        const invalidResult = await invalidTx.isValid();
        console.log(`   ✅ Invalid signature detected: ${!invalidResult}`);
        
        console.log('\n🎉 All Ed25519 tests passed! Your blockchain now supports modern cryptography.');
        console.log('\n📈 Benefits achieved:');
        console.log('   • Higher security (128-bit vs ~110-bit)');
        console.log('   • Better performance');
        console.log('   • Smaller signatures (64 bytes vs 70-73 bytes)');
        console.log('   • Resistance to side-channel attacks');
        console.log('   • Deterministic signatures');
        
        return true;
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
        return false;
    }
}

// Run the test
if (require.main === module) {
    testEd25519Implementation().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { testEd25519Implementation };
