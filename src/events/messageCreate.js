const { processVerification } = require('../services/verification');
const { buildSuccessContainer } = require('../ui/successContainer');
const { buildFailedContainer } = require('../ui/failedContainer');
const { buildLogContainer } = require('../ui/logContainer');
const logger = require('../utils/logger');
const config = require('../config');

module.exports = async (client, message) => {
  if (!message.guild || message.author.bot) {
    return;
  }

  if (message.channelId !== config.VERIFY_CHANNEL_ID) {
    return;
  }

  try {
    const result = await processVerification(message);
    if (!result.ok) {
      const failedPayload = {
        reason: result.reason,
        confidence: 'N/A',
        timestamp: new Date().toLocaleString(),
        retryUrl: `https://discord.com/channels/${message.guild.id}/${message.channel.id}`,
        staffUrl: `https://discord.com/channels/${message.guild.id}/${message.channel.id}`
      };

      if (config.DELETE_FAILED_SCREENSHOT) {
        await message.delete().catch(() => {});
      }

      await message.reply({
        content: result.reason,
        ...buildFailedContainer(failedPayload)
      });
      return;
    }

    const successPayload = {
      username: message.author.username,
      userId: message.author.id,
      verificationId: result.verificationId,
      confidence: result.confidence,
      roleName: 'Verified',
      timestamp: new Date().toLocaleString(),
      reason: result.reason,
      avatarUrl: message.author.displayAvatarURL({ extension: 'png', size: 256 }),
      messageUrl: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`,
      profileUrl: `https://discord.com/users/${message.author.id}`
    };

    const logPayload = {
      verificationId: result.verificationId,
      username: message.author.username,
      userId: message.author.id,
      guild: message.guild.name,
      result: result.approved ? 'Approved' : 'Rejected',
      confidence: result.confidence,
      processingTime: 'N/A',
      hash: result.screenshotHash,
      timestamp: new Date().toLocaleString(),
      avatarUrl: message.author.displayAvatarURL({ extension: 'png', size: 256 }),
      messageUrl: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`,
      profileUrl: `https://discord.com/users/${message.author.id}`
    };

    if (config.DELETE_SUCCESS_SCREENSHOT) {
      await message.delete().catch(() => {});
    }

    await message.reply({
      content: '',
      ...buildSuccessContainer(successPayload)
    });

    if (config.LOG_CHANNEL_ID) {
      const logChannel = client.channels.cache.get(config.LOG_CHANNEL_ID);
      if (logChannel?.isTextBased?.()) {
        await logChannel.send({
          ...buildLogContainer(logPayload)
        });
      }
    }

    logger.info({ user: message.author.tag, guild: message.guild.name, result: result.approved ? 'approved' : 'rejected' }, 'Verification result sent');
  } catch (error) {
    logger.error({ err: error }, 'Message handler failed');
  }
};
