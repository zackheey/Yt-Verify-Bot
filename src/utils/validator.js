const { ALLOWED_IMAGE_TYPES, REJECTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } = require('./constants');

function isSupportedAttachment(attachment) {
  if (!attachment) {
    return { valid: false, reason: 'No attachment provided.' };
  }

  if (!attachment.contentType) {
    return { valid: false, reason: 'Attachment has no content type.' };
  }

  if (REJECTED_IMAGE_TYPES.includes(attachment.contentType.toLowerCase())) {
    return { valid: false, reason: 'Unsupported image format.' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(attachment.contentType.toLowerCase())) {
    return { valid: false, reason: 'Unsupported image format.' };
  }

  if (attachment.size > MAX_IMAGE_SIZE_BYTES) {
    return { valid: false, reason: 'Image exceeds 15 MB limit.' };
  }

  return { valid: true };
}

module.exports = {
  isSupportedAttachment
};
