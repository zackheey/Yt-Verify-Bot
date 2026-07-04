const logger = require('../utils/logger');

module.exports = async (client) => {
  logger.info({ user: client.user.tag, guilds: client.guilds.cache.size }, 'Bot is ready');
};
