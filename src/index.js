import { createHmac } from 'crypto';
import SteamUser from 'steam-user';
import SteamCommunity from 'steamcommunity';
import logger from '../utils/logger.js';

const client = new SteamUser();
const community = new SteamCommunity();

let isLoggedIn = false;

export async function initSteamClient() {
  return new Promise((resolve, reject) => {
    if (isLoggedIn) {
      resolve();
      return;
    }

    const handleLoggedOn = () => {
      logger.info('Successfully logged into Steam');
      isLoggedIn = true;
      resolve();
    };

    const handleError = (error) => {
      logger.error('Steam client error', error.message || error);
      reject(error);
    };

    client.once('loggedOn', handleLoggedOn);
    client.once('error', handleError);

    try {
      client.logOn({
        accountName: process.env.STEAM_BOT_USERNAME,
        password: process.env.STEAM_BOT_PASSWORD,
        ...(process.env.STEAM_SHARED_SECRET ? { twoFactorCode: generateSteamGuardCode(process.env.STEAM_SHARED_SECRET) } : {})
      });
    } catch (error) {
      logger.error('Failed to initiate Steam login', error.message);
      reject(error);
    }
  });
}

export async function sendSteamGroupMessage(notification) {
  try {
    await initSteamClient();

    const groupId = process.env.TARGET_STEAM_GROUP_ID;
    const message = formatSteamMessage(notification);

    logger.info(`Sending message to Steam group ${groupId}`);

    return new Promise((resolve, reject) => {
      community.postGroupAnnouncement(groupId, message, '', (error) => {
        if (error) {
          logger.error('Failed to post to Steam group', error.message);
          reject(error);
        } else {
          logger.info(`Successfully posted to Steam group: ${notification.title}`);
          resolve(true);
        }
      });
    });
  } catch (error) {
    logger.error('Steam group message failed', error.message);
    throw error;
  }
}

function formatSteamMessage(notification) {
  return `🎮 FREE WEEKEND ALERT!\n\n${notification.title}\n\n${notification.description}\n\nStore Link: ${notification.url}\n\nFree Until: ${notification.freeUntil || 'Check Steam store for details'}\n\nDon't miss out!`;
}

function generateSteamGuardCode(sharedSecret) {
  if (!sharedSecret) {
    return '';
  }

  const key = decodeBase32(sharedSecret);
  const time = Math.floor(Date.now() / 30000);
  const timeBuffer = Buffer.alloc(8, 0);
  timeBuffer.writeUInt32BE(0, 0);
  timeBuffer.writeUInt32BE(time, 4);

  const hmac = createHmac('sha1', key).update(timeBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return (code % 1000000).toString().padStart(5, '0');
}

function decodeBase32(input) {
  const cleaned = input.replace(/=+$/, '').toUpperCase();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const output = Buffer.alloc(Math.ceil((cleaned.length * 5) / 8));
  let index = 0;

  for (const char of cleaned) {
    const val = alphabet.indexOf(char);
    if (val === -1) continue;

    value = (value << 5) | val;
    bits += 5;

    if (bits >= 8) {
      bits -= 8;
      output[index++] = (value >> bits) & 0xff;
    }
  }

  return output.subarray(0, index);
}

export function disconnectSteam() {
  if (client) {
    client.logOff();
    isLoggedIn = false;
    logger.info('Disconnected from Steam');
  }
}
