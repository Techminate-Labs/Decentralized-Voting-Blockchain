const logger = require('./logger')

const validateConfig = () => {
  const requiredEnvVars = ['privateKey', 'minorWallet', 'NODE_ENV', 'PORT']
  const missing = []
  
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  })
  
  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }
  
  // Validate private key format
  if (process.env.privateKey && !/^[a-fA-F0-9]{64}$/.test(process.env.privateKey)) {
    logger.error('Private key must be a 64-character hexadecimal string')
    process.exit(1)
  }
  
  // Validate wallet address format  
  if (process.env.minorWallet && !/^[a-fA-F0-9]{64,130}$/.test(process.env.minorWallet)) {
    logger.error('Minor wallet address must be a valid hexadecimal string')
    process.exit(1)
  }
  
  // Production-specific validations
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.SECURE_KEY_STORAGE || process.env.SECURE_KEY_STORAGE !== 'true') {
      logger.error('SECURE_KEY_STORAGE must be enabled in production')
      process.exit(1)
    }
    
    if (process.env.PORT === '3000' || process.env.PORT === '5000') {
      logger.warn('Consider using a non-standard port in production')
    }
  }
  
  logger.success('Configuration validation passed')
}

module.exports = { validateConfig }
