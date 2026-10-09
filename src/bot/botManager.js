import logger from '../utils/logger.js';
import { scrapeFreeSteamGames } from '../scrapers/steamScraper.js';
import { getDatabase } from '../db/database.js';
import { notifyNewGames } from '../notifiers/notificationManager.js';

let checkInterval = null;
let isRunning = false;

export async function startBot() {
  if (isRunning) {
    logger.warn('Bot is already running');
    return;
  }

  const checkIntervalMinutes = parseInt(process.env.CHECK_INTERVAL_MINUTES) || 60;
  const checkIntervalMs = checkIntervalMinutes * 60 * 1000;

  logger.info(`Starting Steam Free Weekend Bot - checking every ${checkIntervalMinutes} minutes`);

  // Run immediately on start
  await performCheck();

  // Set up recurring checks
  checkInterval = setInterval(async () => {
    await performCheck();
  }, checkIntervalMs);

  isRunning = true;
  logger.info('Bot is now running and monitoring for free weekends');
}

export function stopBot() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  isRunning = false;
  logger.info('Bot stopped');
}

async function performCheck() {
  try {
    logger.info('Checking Steam for free weekend games...');
    const games = await scrapeFreeSteamGames();
    
    if (games && games.length > 0) {
      logger.info(`Found ${games.length} free weekend games`);
      
      // Check database for new games
      const db = getDatabase();
      const newGames = [];
      
      for (const game of games) {
        const exists = db.prepare('SELECT id FROM games WHERE app_id = ?').get(game.appId);
        
        if (!exists) {
          // Add to database
          db.prepare(`
            INSERT INTO games (app_id, title, url, free_until, notified)
            VALUES (?, ?, ?, ?, ?)
          `).run(game.appId, game.title, game.url, game.freeUntil, 0);
          newGames.push(game);
        }
      }
      
      if (newGames.length > 0) {
        logger.info(`Found ${newGames.length} new free weekend games to announce`);
        await notifyNewGames(newGames);
      } else {
        logger.info('No new games since last check');
      }
    } else {
      logger.info('No free weekend games currently available');
    }
  } catch (error) {
    logger.error('Error during Steam check:', error.message || error);
  }
}

export function isRunning() {
  return isRunning;
}
