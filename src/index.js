import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { initializeDatabase } from './db/database.js';
import { startScheduler } from './bot/botManager.js';
import { checkFreeWeekends } from './scrapers/steamScraper.js';

dotenv.config();

async function main() {
  try {
    logger.info('Starting Steam Free Weekend Bot...');

    await initializeDatabase();
    logger.info('Database initialized');

    await checkFreeWeekends();
    logger.info('Initial scrape complete');

    startScheduler();
    logger.info('Bot scheduler started');
  } catch (error) {
    logger.error('Startup failed', error);
    process.exit(1);
  }
}

main();

process.on('SIGINT', () => {
  logger.info('Shutdown requested');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutdown requested');
  process.exit(0);
});
