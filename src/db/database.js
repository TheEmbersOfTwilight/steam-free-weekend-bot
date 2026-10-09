import sqlite3 from 'sqlite3';
import logger from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/games.db');

let db = null;

export function initializeDatabase() {
  try {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        logger.error('Failed to open SQLite database:', err.message);
        throw err;
      }
    });

    logger.info(`Database initialized at ${dbPath}`);

    db.run(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        app_id INTEGER UNIQUE NOT NULL,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        free_until TEXT,
        notified INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `, (err) => {
      if (err) {
        logger.error('Failed to create database table:', err.message);
        throw err;
      }
      logger.info('Database tables created/verified');
    });

    return db;
  } catch (error) {
    logger.error('Failed to initialize database:', error.message);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    initializeDatabase();
  }
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    logger.info('Database connection closed');
  }
}

export function addGame(appId, title, url, freeUntil) {
  try {
    if (!db) {
      initializeDatabase();
    }

    db.run(
      `INSERT OR IGNORE INTO games (app_id, title, url, free_until) VALUES (?, ?, ?, ?)`,
      [appId, title, url, freeUntil],
      (err) => {
        if (err) {
          logger.error('Error adding game to database:', err.message);
        }
      }
    );

    return true;
  } catch (error) {
    logger.error('Error adding game to database:', error.message);
    return false;
  }
}

export function getUnnotifiedGames() {
  try {
    if (!db) {
      initializeDatabase();
    }

    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM games WHERE notified = 0', [], (err, rows) => {
        if (err) {
          logger.error('Error fetching unnotified games:', err.message);
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  } catch (error) {
    logger.error('Error fetching unnotified games:', error.message);
    return [];
  }
}

export function markGameNotified(appId) {
  try {
    if (!db) {
      initializeDatabase();
    }

    db.run('UPDATE games SET notified = 1 WHERE app_id = ?', [appId], (err) => {
      if (err) {
        logger.error('Error marking game as notified:', err.message);
      }
    });

    return true;
  } catch (error) {
    logger.error('Error marking game as notified:', err.message);
    return false;
  }
}
