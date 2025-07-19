const colors = require('colors');

const logger = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`.blue);
  },
  
  error: (message, error = null) => {
    console.log(`[ERROR] ${new Date().toISOString()} - ${message}`.red);
    if (error && error.stack) {
      console.log(error.stack.red);
    }
  },
  
  warn: (message) => {
    console.log(`[WARN] ${new Date().toISOString()} - ${message}`.yellow);
  },
  
  success: (message) => {
    console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`.green);
  },
  
  mining: (message) => {
    console.log(`[MINING] ${new Date().toISOString()} - ${message}`.magenta);
  },
  
  network: (message) => {
    console.log(`[NETWORK] ${new Date().toISOString()} - ${message}`.cyan);
  }
};

module.exports = logger;
