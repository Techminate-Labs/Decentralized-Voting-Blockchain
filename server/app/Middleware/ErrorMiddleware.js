const logger = require('../../utils/logger');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, err);

    // Record error in metrics
    const metrics = require('../../utils/metrics');
    metrics.recordError(err);

    // Blockchain specific errors
    if (err.message.includes('Insufficient balance')) {
        error.statusCode = 400;
    }

    if (err.message.includes('Invalid signature') || err.message.includes('Cannot add invalid transaction')) {
        error.statusCode = 400;
    }

    if (err.message.includes('Too many pending transactions')) {
        error.statusCode = 429;
    }

    if (err.message.includes('Duplicate transaction detected')) {
        error.statusCode = 409;
    }

    if (err.message.includes('Invalid recipient address') || err.message.includes('Amount must be a positive number')) {
        error.statusCode = 400;
    }

    const statusCode = error.statusCode || res.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        error: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    });
};

module.exports = {
    errorHandler,
};