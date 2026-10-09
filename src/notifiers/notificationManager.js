import logger from '../utils/logger.js';
import { sendSteamGroupMessage } from '../index.js';
import { markGameNotified } from '../db/database.js';

export async function notifyNewGames(games) {
  if (!games || games.length === 0) {
    logger.info('No games to notify about');
    return;
  }

  logger.info(`Notifying about ${games.length} new free weekend games`);

  for (const game of games) {
    try {
      const notification = {
        title: `🎮 ${game.title}`,
        description: 'Free Weekend Available',
        url: game.url,
        freeUntil: game.freeUntil || 'Check Steam store for details'
      };

      await sendSteamGroupMessage(notification);
      
      // Mark as notified in database
      markGameNotified(game.appId);
      
      logger.info(`Notified about: ${game.title}`);
    } catch (error) {
      logger.error(`Failed to notify about ${game.title}:`, error.message);
    }
  }
}

export async function testNotification() {
  const testNotification = {
    title: '🎮 Test Free Weekend Game',
    description: 'This is a test notification from the Steam Free Weekend Bot',
    url: 'https://store.steampowered.com',
    freeUntil: new Date().toISOString()
  };

  try {
    await sendSteamGroupMessage(testNotification);
    logger.info('Test notification sent successfully');
  } catch (error) {
    logger.error('Failed to send test notification:', error.message);
  }
}
