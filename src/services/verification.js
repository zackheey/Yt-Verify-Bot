const path = require('path');
const sharp = require('sharp');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const { analyzeImage } = require('./groq');
const { hashFile } = require('./imageHash');
const { downloadImage, deleteTempFile } = require('./downloader');
const { ensureUserNotExists, recordVerification } = require('../database/database');
const { getCooldownRemaining } = require('./cooldown');
const logger = require('../utils/logger');
const config = require('../config');

async function processVerification(message) {
  const startTime = Date.now();

  try {
    const attachment = message.attachments.first();
    if (!attachment) {
      return { ok: false, reason: 'No image attachment found.' };
    }

    if (message.author.bot) {
      return { ok: false, reason: 'Bots are ignored.' };
    }

    if (message.channelId !== config.VERIFY_CHANNEL_ID) {
      return { ok: false, reason: 'Channel is not configured for verification.' };
    }

    if (ensureUserNotExists(message.author.id)) {
      return { ok: false, reason: 'You have already verified.' };
    }

    const cooldownMinutes = getCooldownRemaining(message.author.id);
    if (cooldownMinutes !== null && cooldownMinutes > 0) {
      return { ok: false, reason: `Please wait ${cooldownMinutes} minute(s) before verifying again.` };
    }

    const { valid, reason } = require('../utils/validator').isSupportedAttachment(attachment);
    if (!valid) {
      return { ok: false, reason };
    }

    const fileName = `${message.author.id}-${Date.now()}-${path.basename(attachment.name || 'image')}`;
    const downloadedPath = await downloadImage(attachment.url, fileName);

    const optimizedPath = `${downloadedPath}.optimized.webp`;
    await sharp(downloadedPath)
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(optimizedPath);

    const screenshotHash = await hashFile(optimizedPath);

    const existingHash = require('../database/database').db.prepare('SELECT discord_id FROM users WHERE screenshot_hash = ?').get(screenshotHash);
    if (existingHash) {
      await deleteTempFile(downloadedPath);
      await deleteTempFile(optimizedPath);
      return { ok: false, reason: 'This screenshot has already been used.' };
    }

    const imageBuffer = await fs.readFile(optimizedPath);
    const imageBase64 = imageBuffer.toString('base64');
    const analysis = await analyzeImage({
      imageBase64,
      mimeType: 'image/webp',
      channelName: config.YOUTUBE_CHANNEL_NAME,
      channelHandle: config.YOUTUBE_CHANNEL_HANDLE,
      minConfidence: config.MIN_CONFIDENCE
    });

    const approved = analysis.approved;
    const aiReason = analysis.reason || 'No reason provided.';
    const confidence = analysis.confidence || 0;

    const verificationId = uuidv4();
    const result = approved ? 'approved' : 'rejected';

    if (approved) {
      const role = message.guild.roles.cache.get(config.VERIFIED_ROLE_ID);
      if (role) {
        await message.member.roles.add(role).catch(() => {});
      }
    }

    recordVerification({
      discordId: message.author.id,
      username: message.author.username,
      guildId: message.guildId,
      verifiedAt: new Date().toISOString(),
      confidence,
      screenshotHash,
      messageId: message.id,
      imageUrl: attachment.url,
      verificationId,
      aiReason
    });

    await deleteTempFile(downloadedPath);
    await deleteTempFile(optimizedPath);

    logger.info({
      user: message.author.tag,
      guild: message.guild?.name || 'Unknown',
      processingTime: `${Date.now() - startTime}ms`,
      confidence,
      hash: screenshotHash,
      result
    }, 'Verification processed');

    return {
      ok: true,
      approved,
      confidence,
      reason: aiReason,
      verificationId,
      screenshotHash,
      messageId: message.id,
      imageUrl: attachment.url
    };
  } catch (error) {
    logger.error({ err: error }, 'Verification processing failed');
    return { ok: false, reason: 'Verification failed due to an unexpected error.' };
  }
}

module.exports = {
  processVerification
};
