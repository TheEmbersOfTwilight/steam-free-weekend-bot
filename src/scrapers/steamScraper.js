import axios from 'axios';
import * as cheerio from 'cheerio';
import logger from '../utils/logger.js';

const STEAM_SPECIALS_URL = 'https://steamcommunity.com/search/runs/';
const STEAM_STORE_URL = 'https://store.steampowered.com';

export async function scrapeFreeSteamGames() {
  try {
    logger.info('Scraping Steam for free weekend listings...');
    
    // Fetch Steam store specials page
    const response = await axios.get(`${STEAM_STORE_URL}/specials/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const games = [];

    // Look for free weekend tags in search results
    $('[data-ca-content-layout="item_ca_90"]').each((index, element) => {
      const $elem = $(element);
      const tags = $elem.find('.app_tag').text().toLowerCase();
      
      // Check if this item has a free weekend tag
      if (tags.includes('free weekend') || tags.includes('free to play')) {
        const title = $elem.find('.title').text().trim();
        const appId = $elem.attr('data-app-id');
        const url = `${STEAM_STORE_URL}/app/${appId}/`;
        
        if (title && appId) {
          games.push({
            appId: parseInt(appId),
            title: title,
            url: url,
            freeUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // Estimate 3 days
          });
          
          logger.info(`Found free weekend game: ${title} (App ID: ${appId})`);
        }
      }
    });

    return games;
  } catch (error) {
    logger.error('Error scraping Steam:', error.message || error);
    return [];
  }
}

export function validateFreeWeekendGame(game) {
  return game && game.appId && game.title && game.url;
}
