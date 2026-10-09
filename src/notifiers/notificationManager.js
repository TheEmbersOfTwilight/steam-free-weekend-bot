import logger from '../utils/logger.js';
import { sendSteamGroupMessage } from './steamNotifier.js';

export async function sendNotification(notification) {
  if (!process.env.STEAM_BOT_USERNAME || !process.env.TARGET_STEAM_GROUP_ID) {
    logger.warn('Steam bot credentials not configured. Cannot send notification.');
    return;
  }

  try {
    await sendSteamGroupMessage(notification);
  } catch (error) {
    logger.error('Failed to send Steam group message', error.message);
    throw error;
  }
}
