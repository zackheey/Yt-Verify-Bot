const axios = require('axios');
const { GROQ_API_KEY } = require('../config');
const logger = require('../utils/logger');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function analyzeImage({ imageBase64, mimeType, channelName, channelHandle, minConfidence }) {
  if (!GROQ_API_KEY) {
    return {
      approved: false,
      reason: 'Groq API key is not configured.',
      confidence: 0,
      raw: null
    };
  }

  const payload = {
    model: 'llama-3.2-90b-vision-preview',
    messages: [
      {
        role: 'system',
        content: 'You analyze screenshots. Return only JSON.'
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Determine whether this screenshot is a genuine YouTube subscription screenshot. Consider the channel name exactly: ${channelName}. Consider the channel handle exactly: ${channelHandle}. Return ONLY JSON with keys: youtube, subscribed, channel_match, handle_match, edited, cropped, blurry, confidence, reason.`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`
            }
          }
        ]
      }
    ],
    temperature: 0,
    max_tokens: 300
  };

  try {
    const response = await axios.post(GROQ_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      timeout: 60000
    });

    const content = response?.data?.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      approved: Boolean(parsed.youtube && parsed.subscribed && parsed.channel_match && parsed.handle_match && !parsed.edited && !parsed.cropped && !parsed.blurry && Number(parsed.confidence || 0) >= minConfidence),
      confidence: Number(parsed.confidence || 0),
      reason: parsed.reason || 'Unable to determine.',
      raw: parsed
    };
  } catch (error) {
    logger.error({ err: error }, 'Groq vision analysis failed');
    return {
      approved: false,
      reason: 'Groq analysis failed.',
      confidence: 0,
      raw: null
    };
  }
}

module.exports = {
  analyzeImage
};
