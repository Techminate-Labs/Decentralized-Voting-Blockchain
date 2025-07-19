const asyncHandler = require('express-async-handler');
const Blockchain = require('../Blockchain/Blockchain');
const Transaction = require('../Blockchain/Transaction');
const { isChainValid } = require('../Blockchain/Validation');
const { ConnectNodes } = require('../Blockchain/Network');

const EC = require('elliptic').ec;
const integrityMonitor = require('../../utils/integrityMonitor');
const auditLogger = require('../../utils/auditLogger');

let myChain = new Blockchain();
const ec = new EC('secp256k1');

let wsHandler; // Will be set after server initialization

const transactionCreate = asyncHandler(
    async (req, res) => {
        const { recipient, amount } = req.body

        // Input validation
        if (!recipient || typeof recipient !== 'string') {
            return res.status(400).json({ error: 'Invalid recipient address' });
        }

        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number' });
        }

        const myKeyPair = ec.keyFromPrivate(process.env.privateKey)
        const myWalletAddress = myKeyPair.getPublic('hex');

        // Check balance before creating transaction
        const balance = myChain.getBalanceOfAddress(myWalletAddress);
        if (balance < Number(amount)) {
            return res.status(400).json({ 
                error: 'Insufficient balance',
                currentBalance: balance,
                requestedAmount: Number(amount)
            });
        }

        const txs = new Transaction(myWalletAddress, recipient, Number(amount))
        txs.signTransaction(myKeyPair)

        // Security: Audit transaction creation
        auditLogger.logTransaction(txs, req.ip);

        // Security: Analyze transaction pattern
        integrityMonitor.analyzeTransactionPattern(txs);

        console.log('adding transaction to pending list....')
        myChain.addTransaction(txs)

        // Security: Validate chain integrity
        integrityMonitor.validateChainIntegrity(myChain);

        // Record metrics
        const metrics = require('../../utils/metrics')
        metrics.recordTransaction()

        // Notify WebSocket clients
        if (wsHandler) {
            wsHandler.notifyNewTransaction({
                from: myWalletAddress,
                to: recipient,
                amount: Number(amount),
                timestamp: txs.timestamp
            });
        }

        res.status(200).json({
            message: 'Transaction created successfully',
            transaction: {
                from: myWalletAddress,
                to: recipient,
                amount: Number(amount),
                timestamp: txs.timestamp
            },
            pendingTransactions: myChain.getPendingTxs().length,
            remainingBalance: balance - Number(amount)
        })
    }
)

const minePendingTxs = asyncHandler(
    async (req, res) => {
        if (myChain.pendingTransactions.length === 0) {
            return res.status(400).json({ error: 'No pending transactions to mine' });
        }

        const startTime = Date.now()
        const statusMining = myChain.minePendingTransactions(process.env.minorWallet)
        const miningTime = Date.now() - startTime
        
        // Security: Audit block mining
        auditLogger.logBlockMined(myChain.getLatestBlock(), req.ip);
        
        // Security: Validate chain integrity after mining
        integrityMonitor.validateChainIntegrity(myChain);
        
        // Record metrics
        const metrics = require('../../utils/metrics')
        metrics.recordBlockMined(miningTime)
        
        // Notify WebSocket clients
        if (wsHandler) {
            wsHandler.notifyNewBlock(myChain.getLatestBlock());
        }

        res.status(200).json({
            message: statusMining,
            chainLength: myChain.chain.length,
            latestBlock: myChain.getLatestBlock(),
            minerReward: myChain.miningReward
        })
    }
)

const chainList = asyncHandler(
    async (req, res) => {
        res.status(200).json(myChain.getChain())
    }
)

const chainValidation = asyncHandler(
    async (req, res) => {
        res.status(200).json(isChainValid(myChain))
    }
)

const nodeConnection = asyncHandler(
    async (req, res) => {
        res.status(200).json(ConnectNodes(myChain, req))
    }
)

const chainSync = asyncHandler(
    async (req, res) => {
        let response = await myChain.replaceChain()
        console.log(response)
        
        // Notify WebSocket clients
        if (wsHandler) {
            wsHandler.notifyChainSync(response);
        }
        
        res.status(200).json(response)
    }
)


// Function to set WebSocket handler reference
const setWebSocketHandler = (handler) => {
    wsHandler = handler;
};

module.exports = {
    transactionCreate,
    minePendingTxs,
    chainList,
    chainValidation,
    nodeConnection,
    chainSync,
    setWebSocketHandler,
    myChain // Export the blockchain instance
}