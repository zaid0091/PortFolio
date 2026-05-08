/**
 * /api/chat — Vercel Serverless Function
 *
 * Proxies chat requests to Mistral API so the API key
 * never leaves the server. Includes rate limiting and
 * input validation.
 */

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MODEL = 'mistral-small-latest';
const MAX_MESSAGES = 12; // system + 10 history + 1 user
const MAX_MESSAGE_LENGTH = 2000;

// Simple in-memory rate limiter (per Vercel instance)
const rateMap = new Map();
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT = 15; // max requests per window

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT) return true;
  return false;
}

/**
 * Validate and sanitize the messages array.
 * Returns sanitized messages or throws with a reason string.
 */
function validateMessages(messages) {
  if (!Array.isArray(messages)) {
    throw 'messages must be an array';
  }

  if (messages.length > MAX_MESSAGES) {
    throw `Too many messages (max ${MAX_MESSAGES})`;
  }

  const validRoles = new Set(['system', 'user', 'assistant']);

  return messages.map((msg, i) => {
    if (!msg || typeof msg !== 'object') {
      throw `messages[${i}] is not an object`;
    }

    const { role, content } = msg;

    if (!validRoles.has(role)) {
      throw `messages[${i}] has invalid role: ${role}`;
    }

    if (typeof content !== 'string' || content.length === 0) {
      throw `messages[${i}] has empty or non-string content`;
    }

    if (content.length > MAX_MESSAGE_LENGTH && role !== 'system') {
      throw `messages[${i}] content exceeds ${MAX_MESSAGE_LENGTH} chars`;
    }

    // Return only role and content — strip any extra fields
    return { role, content };
  });
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
  }

  // Check server-side API key
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    console.error('MISTRAL_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'AI service is not configured.' });
  }

  // Validate request body
  let messages;
  try {
    messages = validateMessages(req.body?.messages);
  } catch (reason) {
    return res.status(400).json({ error: `Invalid request: ${reason}` });
  }

  // Proxy to Mistral with streaming
  try {
    const mistralRes = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
        max_tokens: 512,
        temperature: 0.6,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!mistralRes.ok) {
      const status = mistralRes.status;
      if (status === 401) return res.status(500).json({ error: 'AI service authentication failed.' });
      if (status === 429) return res.status(429).json({ error: 'Rate limit reached. Please wait a moment.' });
      return res.status(502).json({ error: `AI service error (${status}).` });
    }

    // Stream the response back to the client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = mistralRes.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
    } finally {
      reader.releaseLock();
    }

    res.end();
  } catch (err) {
    if (err.name === 'TimeoutError') {
      return res.status(504).json({ error: 'AI service timed out. Please try again.' });
    }
    console.error('Chat proxy error:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
