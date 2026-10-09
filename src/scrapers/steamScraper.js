import axios from 'axios';
import * as cheerio from 'cheerio';
import logger from '../utils/logger.js';
import { upsertGame, getUnnotifiedGames, markNotified, logNotification } from '../db/database.js';
import { sendNotification } from '../notifiers/notificationManager.js';

const STEAM_SPECIALS_URL = 'https://store.steampowered.com/specials';

export async function checkFreeWeekends() {
  try {
    logger.info('Checking Steam for free weekend items...');

    const games = await fetchFeaturedWeekendGames();
    if (!games || games.length === 0) {
      logger.info('No Steam free weekend games found in the current scrape.');
      return [];
    }

    for (const game of games) {
      try {
        await upsertGame(game);
      } catch (error) {
        logger.warn(`Unable to save game ${game.name}`, error.message);
      }
    }

    const unnotified = await getUnnotifiedGames();

    for (const game of unnotified) {
      try {
        await sendNotification({
          title: `🎮 ${game.name} is free this weekend!`,
          description: `Steam is offering ${game.name} for free this weekend.`,
          url: game.store_url,
          image: game.image_url,
          freeUntil: game.free_until,
          appId: game.app_id
        });

        await markNotified(game.app_id);
        await logNotification(game.app_id, 'system', `Free weekend alert sent for ${game.name}`, 'success');
      } catch (error) {
        logger.error(`Failed to notify for ${game.name}`, error.message);
        await logNotification(game.app_id, 'system', error.message, 'error');
      }
    }

    return games;
  } catch (error) {
    logger.error('Steam free weekend check failed', error.message);
    return [];
  }
}

async function fetchFeaturedWeekendGames() {
  const response = await axios.get(STEAM_SPECIALS_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
  });

  const $ = cheerio.load(response.data);
  const results = [];

  $('.saleitembrowser_widget').each((_, element) => {
    const $el = $(element);
    const name = $el.find('.title').first().text().trim();
    const appLink = $el.find('a[href*="/app/"]').first().attr('href');
    const image = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
    const appId = extractAppId(appLink);

    if (!name || !appId) return;

    results.push({
      app_id: appId,
      name,
      store_url: appLink ? `https://store.steampowered.com${appLink}` : `https://store.steampowered.com/app/${appId}`,
      image_url: image,
      free_until: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      discount_percent: 100
    });
  });

  return results;
}

function extractAppId(url) {
  if (!url) return null;
  const match = url.match(/\/app\/(\d+)/i);
  return match ? match[1] : null;
}
