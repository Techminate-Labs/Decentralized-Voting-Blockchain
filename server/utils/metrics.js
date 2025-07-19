class BlockchainMetrics {
  constructor() {
    this.metrics = {
      transactionsProcessed: 0,
      blocksMinedTotal: 0,
      averageMiningTime: 0,
      networkLatency: 0,
      startTime: Date.now(),
      memoryUsage: process.memoryUsage(),
      errors: []
    }
    
    // Update metrics periodically
    setInterval(() => this.updateSystemMetrics(), 30000)
  }
  
  recordTransaction() {
    this.metrics.transactionsProcessed++
  }
  
  recordBlockMined(miningTime) {
    this.metrics.blocksMinedTotal++
    const currentAvg = this.metrics.averageMiningTime
    const totalBlocks = this.metrics.blocksMinedTotal
    this.metrics.averageMiningTime = (currentAvg * (totalBlocks - 1) + miningTime) / totalBlocks
  }
  
  recordError(error) {
    this.metrics.errors.push({
      timestamp: Date.now(),
      message: error.message,
      stack: error.stack
    })
    
    // Keep only last 100 errors
    if (this.metrics.errors.length > 100) {
      this.metrics.errors = this.metrics.errors.slice(-100)
    }
  }
  
  updateSystemMetrics() {
    this.metrics.memoryUsage = process.memoryUsage()
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      uptimeHours: Math.round((Date.now() - this.metrics.startTime) / 3600000)
    }
  }
}

const metrics = new BlockchainMetrics()
module.exports = metrics
module.exports = metrics
