const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const axios = require('axios');
const { pipeline } = require('stream/promises');
const { TEMP_DIR } = require('../utils/constants');

async function ensureTempDir() {
  await fs.mkdir(TEMP_DIR, { recursive: true });
}

async function downloadImage(url, fileName) {
  await ensureTempDir();
  const targetPath = path.join(TEMP_DIR, fileName);
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'stream',
    timeout: 20000
  });

  await pipeline(response.data, fsSync.createWriteStream(targetPath));
  return targetPath;
}

async function deleteTempFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore cleanup errors.
  }
}

module.exports = {
  ensureTempDir,
  downloadImage,
  deleteTempFile
};
