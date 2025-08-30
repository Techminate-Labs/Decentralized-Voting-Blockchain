const express = require('express')
const router = express.Router()
const { validateTransaction, validateNodeConnection } = require('../middleware/validation')
const { enhancedTransactionValidation } = require('../middleware/enhancedValidation')
const { rateLimit } = require('../middleware/rateLimiter')

const {
    generateKeys
} = require('../app/Controllers/WalletController')
const {
    chainList,
    transactionCreate,
    minePendingTxs,
    bootstrapMine,
    chainValidation,
    nodeConnection,
    chainSync
} = require('../app/Controllers/BlockchainController')

// Enhanced health check endpoint
router.get('/health', (req, res) => {
    const metrics = require('../utils/metrics')
    const myChain = require('../app/Controllers/BlockchainController').myChain
    
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: require('../../package.json').version,
        uptime: process.uptime(),
        blockchain: {
            chainLength: myChain ? myChain.chain.length : 0,
            pendingTxs: myChain ? myChain.pendingTransactions.length : 0,
            connectedNodes: myChain ? myChain.nodes.length : 0
        },
        system: {
            memory: process.memoryUsage(),
            pid: process.pid,
            platform: process.platform,
            nodeVersion: process.version
        },
        metrics: metrics.getMetrics()
    })
})

// Standard endpoints
router.get('/generateKeys', generateKeys)
router.get('/chainList', chainList)
router.get('/chainValidation', chainValidation)
router.get('/chainSync', chainSync)

// Rate-limited endpoints with enhanced validation
router.post('/transactionCreate', rateLimit(5, 60000), enhancedTransactionValidation, transactionCreate)
router.get('/minePendingTxs', rateLimit(2, 60000), minePendingTxs)
router.get('/bootstrapMine', rateLimit(1, 300000), bootstrapMine) // 5 minute cooldown for bootstrap
router.post('/nodeConnection', rateLimit(3, 60000), validateNodeConnection, nodeConnection)

// Statistics endpoints
const { getBlockchainStats, getTransactionHistory } = require('../controllers/StatsController')
router.get('/stats', getBlockchainStats)
router.get('/transactions/:address', getTransactionHistory)

module.exports = router