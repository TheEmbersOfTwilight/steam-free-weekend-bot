import axios from 'axios';
import logger from '../utils/logger.js';

export async function sendSteamGroupMessage(notification) {
  const message = `🎮 FREE WEEKEND ALERT\n\n${notification.title}\n${notification.description}\n\nLink: ${notification.url}\nFree Until: ${notification.freeUntil || 'Not specified'}`;

  logger.info(`Steam group message prepared: ${message}`);

  // This is a starter implementation. In a real Steam group bot, you would use a Steam client library and authenticated login.
  // The message is logged so it can be routed to actual Steam APIs later.
  return { ok: true, message };
}

export async function sendDiscordMessage(notification) {
  const payload = {
    username: 'Steam Free Weekend Bot',
    embeds: [
      {
        title: notification.title,
        description: notification.description,
        url: notification.url,
        color: 0x00aeef,
        thumbnail: notification.image ? { url: notification.image } : undefined,
        fields: [
          { name: 'Free Until', value: notification.freeUntil || 'Not specified', inline: false }
        ]
      }
    ]
  };

  await axios.post(process.env.DISCORD_WEBHOOK_URL, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  logger.info(`Discord notification sent for ${notification.title}`);
  return { ok: true };
}
