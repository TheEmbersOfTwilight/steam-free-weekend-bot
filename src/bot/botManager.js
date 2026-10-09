import logger from '../utils/logger.js';
import { scrapeFreeSteamGames } from '../scrapers/steamSteamScraper.js';
import { getDatabase, addGame } from '../db/database.js';
import { notifyNewGames } from '../notifiers/notificationManager.js';

let checkInterval = null;
let botRunning = false;

export async function startBot() {
  if (botRunning) {
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

  botRunning = true;
  logger.info('Bot is now running and monitoring for free weekends');
}

export function stopBot() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  botRunning = false;
  logger.info('Bot stopped');
}

async function performCheck() {
  try {
    logger.info('Checking Steam for free weekend games...');
    const games = await scrapeFreeSteamGames();
    
    if (games && games.length > 0) {
      logger.info(`Found ${games.length} free weekend games`);
      
      const newGames = [];
      
      for (const game of games) {
        // Check if game already exists in database
        const db = getDatabase();
        
        db.get('SELECT id FROM games WHERE app_id = ?', [game.appId], (err, row) => {
          if (err) {
            logger.error(`Error checking game ${game.appId}:`, err.message);
            return;
          }
          
          if (!row) {
            // Add new game to database
            addGame(game.appId, game.title, game.url, game.freeUntil);
            newGames.push(game);
            logger.info(`Added new game to database: ${game.title}`);
          }
        });
      }
      
      // Notify after a short delay to allow database writes
      setTimeout(async () => {
        if (newGames.length > 0) {
          logger.info(`Found ${newGames.length} new free weekend games to announce`);
          await notifyNewGames(newGames);
        } else {
          logger.info('No new games since last check');
        }
      }, 1000);
    } else {
      logger.info('No free weekend games currently available');
    }
  } catch (error) {
    logger.error('Error during Steam check:', error.message || error);
  }
}

export function isBotRunning() {
  return botRunning;
}
