const validateTransaction = (req, res, next) => {
    const { recipient, amount } = req.body;
    
    // Validate recipient address (should be hex string of specific length)
    if (!recipient || typeof recipient !== 'string') {
        return res.status(400).json({ error: 'Recipient address is required and must be a string' });
    }
    
    // Validate amount
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    
    // Additional validation: check for reasonable limits
    if (parseFloat(amount) > 1000000) {
        return res.status(400).json({ error: 'Amount exceeds maximum allowed limit' });
    }
    
    next();
};

const validateNodeConnection = (req, res, next) => {
    const { nodes } = req.body;
    
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
        return res.status(400).json({ error: 'Nodes array is required and must not be empty' });
    }
    
    // Validate each node URL
    for (const node of nodes) {
        if (typeof node !== 'string' || !node.startsWith('http')) {
            return res.status(400).json({ error: 'Each node must be a valid HTTP URL' });
        }
    }
    
    next();
};

module.exports = { 
    validateTransaction, 
    validateNodeConnection 
};
