import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { initializeDatabase } from './db/database.js';
import { startScheduler } from './bot/botManager.js';
import { checkFreeWeekends } from './scrapers/steamScraper.js';
import { initSteamClient, disconnectSteam } from './notifiers/steamNotifier.js';

dotenv.config();

async function main() {
  try {
    logger.info('Starting Steam Free Weekend Bot...');

    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized');

    // Initialize Steam client
    logger.info('Initializing Steam client...');
    await initSteamClient();
    logger.info('Steam client ready');

    // Perform initial check
    await checkFreeWeekends();
    logger.info('Initial scrape complete');

    // Start scheduler for periodic checks
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
  disconnectSteam();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutdown requested');
  disconnectSteam();
  process.exit(0);
});
