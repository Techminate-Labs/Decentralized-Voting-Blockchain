const { spawn } = require('child_process');
const colors = require('colors');

console.log('🚀 Starting Production Blockchain Node...'.blue);

// Set production environment
process.env.NODE_ENV = 'production';

// Run security check first
console.log('🔍 Running pre-startup security check...'.yellow);

const securityCheck = spawn('node', ['scripts/securityCheck.js'], {
  stdio: 'inherit'
});

securityCheck.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Security check passed. Starting node...'.green);
    
    // Start the blockchain node
    const node = spawn('node', ['server/server.js'], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    node.on('close', (code) => {
      console.log(`Blockchain node exited with code ${code}`.yellow);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down blockchain node...'.yellow);
      node.kill('SIGINT');
    });
    
  } else {
    console.log('❌ Security check failed. Aborting startup.'.red);
    process.exit(1);
  }
});
