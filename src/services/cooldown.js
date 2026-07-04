const { getRecentVerification } = require('../database/database');
const { COOLDOWN_MINUTES } = require('../config');

function getCooldownRemaining(discordId) {
  const recent = getRecentVerification(discordId, COOLDOWN_MINUTES);
  if (!recent) {
    return null;
  }

  const cutoff = Date.now() - COOLDOWN_MINUTES * 60 * 1000;
  const verifiedAt = new Date(recent.verified_at).getTime();
  const remainingMs = verifiedAt + COOLDOWN_MINUTES * 60 * 1000 - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 60000) : 0;
}

module.exports = {
  getCooldownRemaining
};
