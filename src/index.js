const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config');
const logger = require('./utils/logger');
const { ensureTempDir } = require('./services/downloader');
const { db } = require('./database/database');

async function main() {
  await ensureTempDir();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message]
  });

  client.once('ready', async () => {
    require('./events/ready')(client);
  });

  client.on('messageCreate', async (message) => {
    await require('./events/messageCreate')(client, message);
  });

  if (!config.BOT_TOKEN) {
    logger.warn('BOT_TOKEN is not configured. Starting in dry-run mode.');
    await new Promise(() => {});
    return;
  }

  try {
    await client.login(config.BOT_TOKEN);
  } catch (error) {
    logger.error({ err: error }, 'Failed to log in to Discord');
  }
}

main().catch((error) => {
  logger.error({ err: error }, 'Bot startup failed');
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
