import axios from 'axios';
import * as cheerio from 'cheerio';
import logger from '../utils/logger.js';
import { upsertGame, getUnnotifiedGames, markNotified, logNotification } from '../db/database.js';
import { sendNotification } from '../notifiers/notificationManager.js';

const STEAM_SPECIALS_URL = 'https://store.steampowered.com/specials';
const FREE_WEEKEND_PATTERNS = [
  /free weekend/i,
  /free.*weekend/i,
  /weekend.*free/i,
  /this weekend.*free/i,
  /free to play.*weekend/i,
  /weekend.*free to play/i
];

export async function checkFreeWeekends() {
  try {
    logger.info('Checking Steam for actual free weekend listings...');

    const games = await fetchFeaturedWeekendGames();
    if (!games || games.length === 0) {
      logger.info('No actual Steam free weekend games found in the current scrape.');
      return [];
    }

    logger.info(`Found ${games.length} Steam free weekend game(s)`);

    for (const game of games) {
      try {
        await upsertGame(game);
      } catch (error) {
        logger.warn(`Unable to save game ${game.name}`, error.message);
      }
    }

    const unnotified = await getUnnotifiedGames();
    logger.info(`${unnotified.length} free weekend game(s) require notification`);

    for (const game of unnotified) {
      try {
        await sendNotification({
          title: `🎮 ${game.name} is free this weekend!`,
          description: `${game.name} is currently part of Steam's free weekend promotion.`,
          url: game.store_url,
          image: game.image_url,
          freeUntil: game.free_until,
          appId: game.app_id
        });

        await markNotified(game.app_id);
        await logNotification(game.app_id, 'steam_group', `Free weekend alert sent for ${game.name}`, 'success');
      } catch (error) {
        logger.error(`Failed to notify for ${game.name}`, error.message);
        await logNotification(game.app_id, 'steam_group', error.message, 'error');
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
  const cardSet = $('.saleitembrowser_widget, .salepreviewwidgets, .saleitem, .game_capsule');

  cardSet.each((_, element) => {
    const $card = $(element);
    const cardHtml = $card.html() || '';
    const cardText = $card.text().replace(/\s+/g, ' ').trim();

    const shouldInclude = FREE_WEEKEND_PATTERNS.some((pattern) => pattern.test(cardText) || pattern.test(cardHtml));
    if (!shouldInclude) return;

    const name = $card.find('.title').first().text().trim()
      || $card.find('a[href*="/app/"]').first().text().trim()
      || $card.find('a').first().text().trim();

    const appLink = $card.find('a[href*="/app/"]').first().attr('href')
      || $card.find('a[href*="/app/"]').attr('href');

    const image = $card.find('img').first().attr('src') || $card.find('img').first().attr('data-src');
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

  return dedupeGames(results);
}

function dedupeGames(games) {
  const seen = new Set();
  return games.filter((game) => {
    if (seen.has(game.app_id)) return false;
    seen.add(game.app_id);
    return true;
  });
}

function extractAppId(url) {
  if (!url) return null;
  const match = url.match(/\/app\/(\d+)/i);
  return match ? match[1] : null;
}
