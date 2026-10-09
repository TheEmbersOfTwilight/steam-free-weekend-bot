import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

const dbPath = process.env.DATABASE_PATH || path.resolve('data', 'games.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error('Database connection failed', err);
    return;
  }
  logger.info(`Connected to SQLite DB: ${dbPath}`);
});

export async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS games (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          app_id TEXT UNIQUE,
          name TEXT NOT NULL,
          store_url TEXT,
          image_url TEXT,
          free_until TEXT,
          discount_percent INTEGER,
          detected_at TEXT DEFAULT CURRENT_TIMESTAMP,
          notified INTEGER DEFAULT 0
        )
      `, (err) => {
        if (err) return reject(err);
      });

      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          app_id TEXT,
          channel TEXT,
          message TEXT,
          sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
          status TEXT
        )
      `, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

export function getDb() {
  return db;
}

export function upsertGame(game) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO games (app_id, name, store_url, image_url, free_until, discount_percent, notified)
      VALUES (?, ?, ?, ?, ?, ?, 0)
      ON CONFLICT(app_id)
      DO UPDATE SET
        name = excluded.name,
        store_url = excluded.store_url,
        image_url = excluded.image_url,
        free_until = excluded.free_until,
        discount_percent = excluded.discount_percent
    `;

    db.run(sql, [
      game.app_id,
      game.name,
      game.store_url,
      game.image_url,
      game.free_until,
      game.discount_percent
    ], function (err) {
      if (err) return reject(err);
      resolve(this.lastID || game.app_id);
    });
  });
}

export function markNotified(appId) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE games SET notified = 1 WHERE app_id = ?', [appId], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

export function getUnnotifiedGames() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM games WHERE notified = 0', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function logNotification(appId, channel, message, status) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO notifications (app_id, channel, message, status) VALUES (?, ?, ?, ?)',
      [appId, channel, message, status],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}
