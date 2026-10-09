const logger = {
  info: (message, ...extra) => console.log(`[INFO] ${new Date().toISOString()} ${message}`, ...extra),
  warn: (message, ...extra) => console.warn(`[WARN] ${new Date().toISOString()} ${message}`, ...extra),
  error: (message, ...extra) => console.error(`[ERROR] ${new Date().toISOString()} ${message}`, ...extra),
  debug: (message, ...extra) => {
    if (process.env.DEBUG === 'true') {
      console.log(`[DEBUG] ${new Date().toISOString()} ${message}`, ...extra);
    }
  }
};

export default logger;
