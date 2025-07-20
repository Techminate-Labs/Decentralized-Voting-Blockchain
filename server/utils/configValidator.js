const logger = require('./logger')

const validateConfig = () => {
  // Only check for basic environment variables, not keys (keys are handled by secureKeyManager)
  const requiredEnvVars = ['NODE_ENV', 'PORT'];
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

// Function to validate keys after they're generated
const validateGeneratedKeys = () => {
  // Validate private key format (after generation)
  if (process.env.privateKey && !/^[a-fA-F0-9]{64}$/.test(process.env.privateKey)) {
    logger.error('Generated private key has invalid format')
    process.exit(1)
  }
  
  // Validate wallet address format (after generation) 
  if (process.env.minorWallet && !/^[a-fA-F0-9]{64,130}$/.test(process.env.minorWallet)) {
    logger.error('Generated minor wallet address has invalid format')
    process.exit(1)
  }
  
  logger.success('Generated keys validation passed')
}

module.exports = { validateConfig, validateGeneratedKeys }
