// const Block = require('./Block');
const Block = require('./Block');
const Blockchain = require('./Blockchain');
const Transaction = require('./Transaction');
const { isChainValid } = require('./Validation');

const EdDSA = require('elliptic').eddsa
const ec = new EdDSA('ed25519')

const privateKey = '2cf2986f33b277f109b9f839442060dbfea9114d6ad7a6bd0301c9a479530a85'
const keyPair = ec.keyFromSecret(privateKey);

const myWalletAddress = keyPair.getPublic('hex');

const recipient = '0ef1fdb82ed1e3d532e2e64672d85a70aeafdcb1b0dedbc18f1541af7ef889b0'

// const block = new Block(Date.parse('2017-01-01'), [], '0');

let myChain = new Blockchain();

console.log('creating transaction 1....')
const txs1 = new Transaction(myWalletAddress, recipient, '10')
txs1.signTransaction(keyPair)
console.log(txs1)


console.log('adding transaction 1 to pending list....')
myChain.addTransaction(txs1)



// console.log('Mining block 1 ....')
// myChain.addBlock(new Block(Date.now(), {amount: 40}))

// console.log('Mining block 2 ....')
// myChain.addBlock(new Block(Date.now(), {amount: 20}))

// console.log('add transaction 1 ....')
// myChain.createTransaction(new Transaction('address1', 'address2', '100'))

// console.log('add transaction 2 ....')
// myChain.createTransaction(new Transaction('address2', 'address3', '100'))

// mine block
// myChain.minePendingTransactions(myWalletAddress)

// console.log('mining reward' ,myChain.getBalanceOfAddress(myWalletAddress))

// var chainJson = JSON.stringify(myChain.getChain(), null, 4)
// console.log(chainJson)

// console.log('is chain valid ? ' + myChain.isChainValid())

// myChain.chain[1].transactions[0].amount = 100
// myChain.chain[1].hash = myChain.chain[1].calculateHash()
// console.log(JSON.stringify(myChain.getChain(), null, 4))
// console.log('is chain valid after mutation ? ' + myChain.isChainValid())

// myChain.chain[1].transactions = { amount : 100 }
// myChain.chain[1].hash = myChain.chain[1].calculateHash()
// console.log('is chain valid after mutation ? ' + myChain.isChainValid())

// this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')

// let hs = '0000a12ab12c'
// console.log('sub string : ' +hs.substring(0, 4))

// let arra = Array(4 + 1).join('0')
// console.log('arr : ' + arra)