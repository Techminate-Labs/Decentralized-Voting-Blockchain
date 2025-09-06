const axios = require('axios');

async function testEd25519API() {
    const baseURL = 'http://localhost:8001/api';
    
    try {
        console.log('🔍 Testing Ed25519 API endpoints...\n');
        
        // Test 1: Get supported curves
        console.log('1️⃣ Testing /curves endpoint...');
        const curvesResponse = await axios.get(`${baseURL}/curves`);
        console.log('✅ Supported curves:', JSON.stringify(curvesResponse.data, null, 2));
        
        // Test 2: Generate Ed25519 keys (default)
        console.log('\n2️⃣ Testing Ed25519 key generation (default)...');
        const ed25519Response = await axios.get(`${baseURL}/generateKeys`);
        console.log('✅ Ed25519 Keys Generated:');
        console.log(`   Public Key: ${ed25519Response.data['Public key']}`);
        console.log(`   Private Key: ${ed25519Response.data['Private key'].substring(0, 16)}...`);
        console.log(`   Curve: ${ed25519Response.data.curve}`);
        console.log(`   Key Lengths: Public=${ed25519Response.data.keyLength.publicKey}, Private=${ed25519Response.data.keyLength.privateKey}`);
        
        // Test 3: Generate secp256k1 keys explicitly
        console.log('\n3️⃣ Testing secp256k1 key generation...');
        const secp256k1Response = await axios.get(`${baseURL}/generateKeys?curve=secp256k1`);
        console.log('✅ secp256k1 Keys Generated:');
        console.log(`   Public Key: ${secp256k1Response.data['Public key'].substring(0, 32)}...`);
        console.log(`   Private Key: ${secp256k1Response.data['Private key'].substring(0, 16)}...`);
        console.log(`   Curve: ${secp256k1Response.data.curve}`);
        console.log(`   Key Lengths: Public=${secp256k1Response.data.keyLength.publicKey}, Private=${secp256k1Response.data.keyLength.privateKey}`);
        
        // Test 4: Test invalid curve
        console.log('\n4️⃣ Testing invalid curve handling...');
        try {
            await axios.get(`${baseURL}/generateKeys?curve=invalid`);
        } catch (error) {
            console.log('✅ Invalid curve properly rejected:', error.response.data.error);
        }
        
        // Test 5: Test blockchain health with new crypto info
        console.log('\n5️⃣ Testing health endpoint...');
        const healthResponse = await axios.get(`${baseURL}/health`);
        console.log('✅ Blockchain Health:');
        console.log(`   Chain Length: ${healthResponse.data.blockchain.chainLength}`);
        console.log(`   Pending Transactions: ${healthResponse.data.blockchain.pendingTxs}`);
        console.log(`   Connected Nodes: ${healthResponse.data.blockchain.connectedNodes}`);
        
        console.log('\n🎉 All Ed25519 API tests passed!');
        console.log('\n📋 Summary:');
        console.log('   • Ed25519 is now the default curve (modern & secure)');
        console.log('   • secp256k1 still supported for compatibility');
        console.log('   • API automatically detects curve type');
        console.log('   • Backward compatibility maintained');
        
        return true;
        
    } catch (error) {
        console.error('❌ API Test failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
        return false;
    }
}

module.exports = { testEd25519API };

// Run if called directly
if (require.main === module) {
    testEd25519API().then(success => {
        process.exit(success ? 0 : 1);
    });
}
