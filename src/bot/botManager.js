import logger from '../utils/logger.js';
import { checkFreeWeekends } from '../scrapers/steamScraper.js';

export function startScheduler() {
  const intervalMinutes = Number(process.env.CHECK_INTERVAL_MINUTES || 60);
  const intervalMs = intervalMinutes * 60 * 1000;

  logger.info(`Scheduler started with interval ${intervalMinutes} minutes`);

  setInterval(async () => {
    try {
      logger.info('Running scheduled Steam check');
      await checkFreeWeekends();
    } catch (error) {
      logger.error('Scheduled check failed', error.message);
    }
  }, intervalMs);
}
