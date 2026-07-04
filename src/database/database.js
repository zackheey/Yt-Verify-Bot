const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

const dbPath = path.join(__dirname, 'subscribers.db');
const dbExists = fs.existsSync(dbPath);
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL');

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  screenshot_hash TEXT NOT NULL,
  message_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  verification_id TEXT UNIQUE NOT NULL,
  ai_reason TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_discord_id ON users(discord_id);
CREATE INDEX IF NOT EXISTS idx_users_guild_id ON users(guild_id);
CREATE INDEX IF NOT EXISTS idx_users_verification_id ON users(verification_id);
`;

db.exec(schema);

if (!dbExists) {
  logger.info('Database initialized at %s', dbPath);
}

function ensureUserNotExists(discordId) {
  const stmt = db.prepare('SELECT 1 FROM users WHERE discord_id = ?');
  return stmt.get(discordId);
}

function recordVerification(data) {
  const stmt = db.prepare(`
    INSERT INTO users (
      discord_id, username, guild_id, verified_at, confidence, screenshot_hash,
      message_id, image_url, verification_id, ai_reason
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.discordId,
    data.username,
    data.guildId,
    data.verifiedAt,
    data.confidence,
    data.screenshotHash,
    data.messageId,
    data.imageUrl,
    data.verificationId,
    data.aiReason
  );
}

function getRecentVerification(discordId, cooldownMinutes) {
  const cutoff = new Date(Date.now() - cooldownMinutes * 60 * 1000).toISOString();
  const stmt = db.prepare('SELECT verified_at FROM users WHERE discord_id = ? AND verified_at >= ? ORDER BY verified_at DESC LIMIT 1');
  return stmt.get(discordId, cutoff);
}

function getUserByDiscordId(discordId) {
  const stmt = db.prepare('SELECT * FROM users WHERE discord_id = ?');
  return stmt.get(discordId);
}

module.exports = {
  db,
  ensureUserNotExists,
  recordVerification,
  getRecentVerification,
  getUserByDiscordId
};
