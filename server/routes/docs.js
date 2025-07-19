const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const apiDocs = {
    title: "Blockchain Node API Documentation",
    version: "1.0.0",
    baseUrl: `http://localhost:${process.env.PORT || 8001}/api`,
    endpoints: {
      health: {
        method: "GET",
        path: "/health",
        description: "Check node health status"
      },
      generateKeys: {
        method: "GET", 
        path: "/generateKeys",
        description: "Generate new wallet keypair"
      },
      createTransaction: {
        method: "POST",
        path: "/transactionCreate",
        description: "Create new transaction",
        body: {
          recipient: "string (required) - recipient wallet address",
          amount: "number (required) - transaction amount"
        },
        rateLimit: "5 requests per minute"
      },
      mine: {
        method: "GET",
        path: "/minePendingTxs", 
        description: "Mine pending transactions",
        rateLimit: "2 requests per minute"
      },
      chainList: {
        method: "GET",
        path: "/chainList",
        description: "Get full blockchain"
      },
      validation: {
        method: "GET", 
        path: "/chainValidation",
        description: "Validate blockchain integrity"
      },
      connect: {
        method: "POST",
        path: "/nodeConnection",
        description: "Connect to network nodes",
        body: {
          nodes: "array (required) - array of node URLs"
        },
        rateLimit: "3 requests per minute"
      },
      sync: {
        method: "GET",
        path: "/chainSync", 
        description: "Synchronize with network"
      },
      stats: {
        method: "GET",
        path: "/stats",
        description: "Get blockchain statistics"
      },
      transactionHistory: {
        method: "GET",
        path: "/transactions/:address",
        description: "Get transaction history for an address"
      }
    }
  };
  
  res.status(200).json(apiDocs);
});

module.exports = router;
