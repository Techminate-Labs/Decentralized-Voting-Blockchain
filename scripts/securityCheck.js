const fs = require('fs');
const path = require('path');
const colors = require('colors');

console.log('🔍 Running Security Check...'.blue);

const checks = [
  {
    name: 'Environment Variables',
    check: () => {
      const envPath = path.join(__dirname, '..', '.env');
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      // Check for plain text keys
      if (envContent.includes('privateKey =') && !envContent.includes('# privateKey')) {
        return { passed: false, message: 'Private key found in plain text' };
      }
      
      return { passed: true, message: 'No sensitive data in .env' };
    }
  },
  {
    name: 'Secure Directory',
    check: () => {
      const securePath = path.join(__dirname, '..', 'server', 'secure');
      if (!fs.existsSync(securePath)) {
        return { passed: false, message: 'Secure directory not found' };
      }
      
      const stats = fs.statSync(securePath);
      const permissions = (stats.mode & parseInt('777', 8)).toString(8);
      
      if (permissions !== '700') {
        return { passed: false, message: `Insecure permissions: ${permissions}` };
      }
      
      return { passed: true, message: 'Secure directory properly protected' };
    }
  },
  {
    name: 'Log Directory',
    check: () => {
      const logPath = path.join(__dirname, '..', 'server', 'logs');
      if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true });
      }
      return { passed: true, message: 'Log directory ready' };
    }
  },
  {
    name: 'Required Security Files',
    check: () => {
      const requiredFiles = [
        'server/utils/secureKeyManager.js',
        'server/utils/integrityMonitor.js',
        'server/utils/auditLogger.js',
        'server/middleware/security.js'
      ];
      
      const missing = requiredFiles.filter(file => 
        !fs.existsSync(path.join(__dirname, '..', file))
      );
      
      if (missing.length > 0) {
        return { passed: false, message: `Missing files: ${missing.join(', ')}` };
      }
      
      return { passed: true, message: 'All security files present' };
    }
  },
  {
    name: 'MongoDB Cleanup',
    check: () => {
      const dbFile = path.join(__dirname, '..', 'server', 'config', 'db.js');
      if (fs.existsSync(dbFile)) {
        const content = fs.readFileSync(dbFile, 'utf8');
        if (!content.includes('DELETE THIS FILE')) {
          return { passed: false, message: 'MongoDB config file still exists' };
        }
      }
      return { passed: true, message: 'MongoDB properly removed' };
    }
  }
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
  try {
    const result = check.check();
    if (result.passed) {
      console.log(`✅ ${check.name}: ${result.message}`.green);
      passed++;
    } else {
      console.log(`❌ ${check.name}: ${result.message}`.red);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${check.name}: Error - ${error.message}`.red);
    failed++;
  }
});

console.log(`\n📊 Security Check Results:`.yellow);
console.log(`Passed: ${passed}`.green);
console.log(`Failed: ${failed}`.red);

if (failed > 0) {
  console.log('\n⚠️  Please address the failed checks before deployment'.yellow);
  process.exit(1);
} else {
  console.log('\n🎉 All security checks passed!'.green);
}
