require('dotenv').config();

function toBoolean(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  VERIFY_CHANNEL_ID: process.env.VERIFY_CHANNEL_ID || '',
  LOG_CHANNEL_ID: process.env.LOG_CHANNEL_ID || '',
  VERIFIED_ROLE_ID: process.env.VERIFIED_ROLE_ID || '',
  STAFF_ROLE_ID: process.env.STAFF_ROLE_ID || '',
  YOUTUBE_CHANNEL_NAME: process.env.YOUTUBE_CHANNEL_NAME || 'Your Channel',
  YOUTUBE_CHANNEL_HANDLE: process.env.YOUTUBE_CHANNEL_HANDLE || '@yourhandle',
  MIN_CONFIDENCE: toNumber(process.env.MIN_CONFIDENCE, 90),
  DELETE_SUCCESS_SCREENSHOT: toBoolean(process.env.DELETE_SUCCESS_SCREENSHOT, true),
  DELETE_FAILED_SCREENSHOT: toBoolean(process.env.DELETE_FAILED_SCREENSHOT, false),
  COOLDOWN_MINUTES: toNumber(process.env.COOLDOWN_MINUTES, 5)
};
