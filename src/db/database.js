import sqlite3 from 'sqlite3';
import Database from 'better-sqlite3';
import logger from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/games.db');

let db = null;

export function initializeDatabase() {
  try {
    // Use better-sqlite3 for sync operations
    db = new Database(dbPath);
    
    logger.info(`Database initialized at ${dbPath}`);
    
    // Create games table if it doesn't exist
    db.exec(`
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
    `);
    
    logger.info('Database tables created/verified');
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
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO games (app_id, title, url, free_until)
      VALUES (?, ?, ?, ?)
    `);
    
    return stmt.run(appId, title, url, freeUntil);
  } catch (error) {
    logger.error('Error adding game to database:', error.message);
    return null;
  }
}

export function getUnnotifiedGames() {
  try {
    const stmt = db.prepare('SELECT * FROM games WHERE notified = 0');
    return stmt.all();
  } catch (error) {
    logger.error('Error fetching unnotified games:', error.message);
    return [];
  }
}

export function markGameNotified(appId) {
  try {
    const stmt = db.prepare('UPDATE games SET notified = 1 WHERE app_id = ?');
    return stmt.run(appId);
  } catch (error) {
    logger.error('Error marking game as notified:', error.message);
    return null;
  }
}
