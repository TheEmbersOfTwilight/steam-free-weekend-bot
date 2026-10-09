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

    await initializeDatabase();
    logger.info('Database initialized');

    if (process.env.STEAM_BOT_USERNAME && process.env.STEAM_BOT_PASSWORD) {
      logger.info('Initializing Steam client...');
      await initSteamClient();
      logger.info('Steam client ready');
    } else {
      logger.warn('Steam account credentials are not configured. The bot will still scrape data but cannot post to a group chat yet.');
    }

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
  disconnectSteam();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutdown requested');
  disconnectSteam();
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
});
