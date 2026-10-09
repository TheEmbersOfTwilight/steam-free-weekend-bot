import SteamUser from 'steam-user';
import SteamCommunity from 'steamcommunity';
import logger from '../utils/logger.js';

const client = new SteamUser();
const community = new SteamCommunity();

let isLoggedIn = false;

/**
 * Initialize Steam client and login
 */
export async function initSteamClient() {
  return new Promise((resolve, reject) => {
    if (isLoggedIn) {
      resolve();
      return;
    }

    client.on('loggedOn', () => {
      logger.info('Successfully logged into Steam');
      isLoggedIn = true;
      community.setCookies(client.cookieJar.getCookies());
      resolve();
    });

    client.on('error', (error) => {
      logger.error('Steam client error', error.message);
      reject(error);
    });

    try {
      client.logOn({
        accountName: process.env.STEAM_BOT_USERNAME,
        password: process.env.STEAM_BOT_PASSWORD,
        ...(process.env.STEAM_SHARED_SECRET && {
          twoFactorCode: generateSteamGuardCode(process.env.STEAM_SHARED_SECRET)
        })
      });
    } catch (error) {
      logger.error('Failed to initiate Steam login', error.message);
      reject(error);
    }
  });
}

/**
 * Send message to Steam group chat
 */
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

/**
 * Format notification as Steam group message
 */
function formatSteamMessage(notification) {
  return `🎮 FREE WEEKEND ALERT!\n\n${notification.title}\n\n${notification.description}\n\nStore Link: ${notification.url}\n\nFree Until: ${notification.freeUntil || 'Check Steam store for details'}\n\nDon't miss out!`;
}

/**
 * Generate Steam Guard code from shared secret
 */
function generateSteamGuardCode(sharedSecret) {
  // Base32 decode the shared secret
  const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let decodedSecret = Buffer.alloc(Math.ceil((sharedSecret.length * 5) / 8));
  
  let bitOffset = 0;
  let bitCount = 0;
  
  for (let i = 0; i < sharedSecret.length; i++) {
    const byte = BASE32_ALPHABET.indexOf(sharedSecret[i].toUpperCase());
    if (byte === -1) throw new Error('Invalid base32 character');
    
    decodedSecret[Math.floor(bitOffset / 8)] |= (byte << (3 + (bitOffset % 8))) & 0xFF;
    bitOffset += 5;
  }

  // Generate TOTP code
  const crypto = await import('crypto');
  const time = Math.floor(Date.now() / 30000);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(time), 0);
  
  const hmac = crypto.createHmac('sha1', decodedSecret);
  hmac.update(timeBuffer);
  const hash = hmac.digest();
  
  const offset = hash[hash.length - 1] & 0x0F;
  const code = (hash[offset] & 0x7F) << 24 |
               (hash[offset + 1] & 0xFF) << 16 |
               (hash[offset + 2] & 0xFF) << 8 |
               (hash[offset + 3] & 0xFF);
  
  return (code % 100000).toString().padStart(5, '0');
}

/**
 * Disconnect from Steam
 */
export function disconnectSteam() {
  if (client) {
    client.logOff();
    isLoggedIn = false;
    logger.info('Disconnected from Steam');
  }
}
