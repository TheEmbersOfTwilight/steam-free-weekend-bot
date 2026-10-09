import logger from '../utils/logger.js';
import { sendSteamGroupMessage } from './steamNotifier.js';
import { sendDiscordMessage } from './discordNotifier.js';

export async function sendNotification(notification) {
  const tasks = [];

  if (process.env.STEAM_BOT_ACCOUNT_NAME && process.env.TARGET_STEAM_GROUP_ID) {
    tasks.push(sendSteamGroupMessage(notification));
  }

  if (process.env.DISCORD_WEBHOOK_URL) {
    tasks.push(sendDiscordMessage(notification));
  }

  if (tasks.length === 0) {
    logger.warn('No notification channels configured. Set Discord or Steam credentials in .env');
    return;
  }

  await Promise.allSettled(tasks);
}
