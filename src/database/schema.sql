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
