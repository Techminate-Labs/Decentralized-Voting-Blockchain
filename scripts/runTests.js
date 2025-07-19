const axios = require('axios');
const colors = require('colors');

const BASE_URL = 'http://localhost:8001/api';
let testResults = { passed: 0, failed: 0 };

async function runTest(testName, testFn) {
  try {
    console.log(`🧪 Running: ${testName}`.yellow);
    await testFn();
    console.log(`✅ ${testName} - PASSED`.green);
    testResults.passed++;
  } catch (error) {
    console.log(`❌ ${testName} - FAILED: ${error.message}`.red);
    testResults.failed++;
  }
}

async function testHealth() {
  const response = await axios.get(`${BASE_URL}/health`);
  if (response.status !== 200) throw new Error('Health check failed');
}

async function testKeyGeneration() {
  const response = await axios.get(`${BASE_URL}/generateKeys`);
  if (!response.data['Public key']) throw new Error('No public key generated');
}

async function testTransaction() {
  const response = await axios.post(`${BASE_URL}/transactionCreate`, {
    recipient: '04a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890abcdef',
    amount: 10
  });
  if (response.status !== 200) throw new Error('Transaction creation failed');
}

async function testMining() {
  const response = await axios.get(`${BASE_URL}/minePendingTxs`);
  if (response.status !== 200) throw new Error('Mining failed');
}

async function testValidation() {
  const response = await axios.get(`${BASE_URL}/chainValidation`);
  if (response.status !== 200) throw new Error('Chain validation failed');
}

async function runAllTests() {
  console.log('🚀 Starting Blockchain Tests...'.blue);
  
  await runTest('Health Check', testHealth);
  await runTest('Key Generation', testKeyGeneration);
  await runTest('Transaction Creation', testTransaction);
  await runTest('Block Mining', testMining);
  await runTest('Chain Validation', testValidation);
  
  console.log(`\n📊 Test Results:`.yellow);
  console.log(`Passed: ${testResults.passed}`.green);
  console.log(`Failed: ${testResults.failed}`.red);
  
  if (testResults.failed === 0) {
    console.log('🎉 All tests passed!'.green);
    process.exit(0);
  } else {
    console.log('❌ Some tests failed'.red);
    process.exit(1);
  }
}

// Run tests with delay for server startup
setTimeout(runAllTests, 2000);
