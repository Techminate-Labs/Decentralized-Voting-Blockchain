const asyncHandler = require('express-async-handler');
const { status } = require('express/lib/response');
const Blockchain = require('../Blockchain/Blockchain');
const Transaction = require('../Blockchain/Transaction');
const { isChainValid } = require('../Blockchain/Validation');
const { ConnectNodes } = require('../Blockchain/Network');

const EC = require('elliptic').ec;

let myChain = new Blockchain();
const ec = new EC('secp256k1');

const transactionCreate = asyncHandler(
    async (req, res) => {
        const { recipient, amount } = req.body

        const myKeyPair = ec.keyFromPrivate(process.env.privateKey)
        const myWalletAddress = myKeyPair.getPublic('hex');

        const txs = new Transaction(myWalletAddress, recipient, Number(amount))
        txs.signTransaction(myKeyPair)

        console.log('adding transaction to pending list....')
        myChain.addTransaction(txs)

        res.status(200).json(myChain.getPendingTxs())
    }
)

const minePendingTxs = asyncHandler(
    async (req, res) => {
        statusMining = myChain.minePendingTransactions(process.env.minorWallet)
        res.status(200).json(statusMining)
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
        res.status(200).json(response)
        // if(response == true){
        //     res.status(200).json('Chain synchronization completed!')
        // }else{
        //     res.status(200).json('Connect to network first')
        // }
    }
)


module.exports = {
    transactionCreate,
    minePendingTxs,
    chainList,
    chainValidation,
    nodeConnection,
    chainSync
}