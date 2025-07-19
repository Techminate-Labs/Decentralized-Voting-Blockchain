const crypto = require('crypto');

const validateWalletAddress = (address) => {
  // Check if address is valid hex string of correct length
  const hexRegex = /^[a-fA-F0-9]+$/;
  return typeof address === 'string' && 
         address.length >= 64 && 
         address.length <= 130 && 
         hexRegex.test(address);
};

const validateTransactionAmount = (amount) => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && 
         numAmount > 0 && 
         numAmount <= 1000000 && 
         numAmount >= 0.00000001; // Minimum satoshi
};

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};

const enhancedTransactionValidation = (req, res, next) => {
  let { recipient, amount } = req.body;
  
  // Sanitize inputs
  recipient = sanitizeInput(recipient);
  amount = sanitizeInput(amount);
  
  // Enhanced recipient validation
  if (!validateWalletAddress(recipient)) {
    return res.status(400).json({ 
      error: 'Invalid recipient address format',
      details: 'Address must be a valid hexadecimal string between 64-130 characters'
    });
  }
  
  // Enhanced amount validation
  if (!validateTransactionAmount(amount)) {
    return res.status(400).json({ 
      error: 'Invalid transaction amount',
      details: 'Amount must be between 0.00000001 and 1,000,000'
    });
  }
  
  // Update request body with sanitized values
  req.body.recipient = recipient;
  req.body.amount = parseFloat(amount);
  
  next();
};

module.exports = {
  enhancedTransactionValidation,
  validateWalletAddress,
  validateTransactionAmount,
  sanitizeInput
};
