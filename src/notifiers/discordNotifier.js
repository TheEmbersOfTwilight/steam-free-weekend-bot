import axios from 'axios';
import logger from '../utils/logger.js';

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

  try {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    logger.info(`Discord notification sent for ${notification.title}`);
    return true;
  } catch (error) {
    logger.error('Discord notification failed', error.response?.data || error.message);
    throw error;
  }
}
