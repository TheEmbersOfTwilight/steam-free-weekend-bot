const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const logger = {
  error: (message, details = '') => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${LOG_LEVELS.ERROR}] ${message}`, details);
  },
  warn: (message, details = '') => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [${LOG_LEVELS.WARN}] ${message}`, details);
  },
  info: (message, details = '') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${LOG_LEVELS.INFO}] ${message}`, details);
  },
  debug: (message, details = '') => {
    if (process.env.DEBUG === 'true') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${LOG_LEVELS.DEBUG}] ${message}`, details);
    }
  }
};

export default logger;
