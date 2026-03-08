const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const DEFAULT_PROVIDER_ORDER =
  'openai,groq,gemini,deepseek,github,apifree,openexo';

const MAX_TOKENS = Number.parseInt(process.env.AI_MAX_TOKENS || '250', 10);
const MAX_HISTORY_ITEMS = 8;
const MAX_MESSAGE_LENGTH = 2000;

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  };
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item) => {
      if (!item || typeof item !== 'object') return false;
      const validRole = item.role === 'user' || item.role === 'assistant';
      const validContent = typeof item.content === 'string';
      return validRole && validContent;
    })
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({
      role: item.role,
      content: item.content.slice(0, MAX_MESSAGE_LENGTH),
    }));
}

function safeErrorMessage(error) {
  const raw = error && error.message ? String(error.message) : String(error);

  return raw
    .replace(/sk-[A-Za-z0-9_-]+/g, '[REDACTED_KEY]')
    .replace(/gsk_[A-Za-z0-9_-]+/g, '[REDACTED_KEY]')
    .replace(/AIza[0-9A-Za-z_-]+/g, '[REDACTED_KEY]')
    .replace(/apf_[A-Za-z0-9_-]+/g, '[REDACTED_KEY]');
}

function normalizeBaseUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.trim().replace(/\/+$/, '');
}

function providerCatalog() {
  return {
    openai: {
      name: 'openai',
      type: 'openai_compatible',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      baseURL: normalizeBaseUrl(process.env.OPENAI_BASE_URL),
    },
    groq: {
      name: 'groq',
      type: 'openai_compatible',
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      baseURL:
        normalizeBaseUrl(process.env.GROQ_BASE_URL) ||
        'https://api.groq.com/openai/v1',
    },
    deepseek: {
      name: 'deepseek',
      type: 'openai_compatible',
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      baseURL:
        normalizeBaseUrl(process.env.DEEPSEEK_BASE_URL) ||
        'https://api.deepseek.com/v1',
    },
    github: {
      name: 'github',
      type: 'openai_compatible',
      apiKey: process.env.GITHUB_MODELS_API_KEY,
      model: process.env.GITHUB_MODELS_MODEL || 'gpt-4o-mini',
      baseURL:
        normalizeBaseUrl(process.env.GITHUB_MODELS_BASE_URL) ||
        'https://models.inference.ai.azure.com',
    },
    apifree: {
      name: 'apifree',
      type: 'openai_compatible',
      apiKey: process.env.APIFREE_API_KEY,
      model: process.env.APIFREE_MODEL || 'gpt-4o-mini',
      baseURL: normalizeBaseUrl(process.env.APIFREE_BASE_URL),
    },
    openexo: {
      name: 'openexo',
      type: 'openai_compatible',
      apiKey: process.env.OPENEXO_API_KEY,
      model: process.env.OPENEXO_MODEL || 'gpt-4o-mini',
      baseURL: normalizeBaseUrl(process.env.OPENEXO_BASE_URL),
    },
    gemini: {
      name: 'gemini',
      type: 'gemini',
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      baseURL:
        normalizeBaseUrl(process.env.GEMINI_BASE_URL) ||
        'https://generativelanguage.googleapis.com/v1beta',
    },
  };
}

function providerOrder() {
  const configured = (process.env.AI_PROVIDER_ORDER || DEFAULT_PROVIDER_ORDER)
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);

  return configured.length ? configured : DEFAULT_PROVIDER_ORDER.split(',');
}

async function callOpenAICompatible(provider, messages) {
  const clientConfig = {
    apiKey: provider.apiKey,
  };

  if (provider.baseURL) {
    clientConfig.baseURL = provider.baseURL;
  }

  const client = new OpenAI(clientConfig);
  const completion = await client.chat.completions.create({
    model: provider.model,
    messages,
    max_tokens: Number.isFinite(MAX_TOKENS) ? MAX_TOKENS : 250,
    temperature: 0.5,
  });

  const reply =
    completion &&
    completion.choices &&
    completion.choices[0] &&
    completion.choices[0].message &&
    completion.choices[0].message.content
      ? completion.choices[0].message.content.trim()
      : '';

  if (!reply) {
    throw new Error('Empty response from provider');
  }

  return reply;
}

async function callGemini(provider, messages, systemPrompt) {
  const endpoint = `${provider.baseURL}/models/${provider.model}:generateContent?key=${provider.apiKey}`;
  const contents = messages
    .filter((msg) => msg.role !== 'system')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

  const geminiResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        maxOutputTokens: Number.isFinite(MAX_TOKENS) ? MAX_TOKENS : 250,
        temperature: 0.5,
      },
    }),
  });

  const payload = await geminiResponse.json().catch(() => null);
  if (!geminiResponse.ok) {
    const message =
      payload && payload.error && payload.error.message
        ? payload.error.message
        : `Gemini request failed (${geminiResponse.status})`;
    throw new Error(message);
  }

  const parts =
    payload &&
    payload.candidates &&
    payload.candidates[0] &&
    payload.candidates[0].content &&
    payload.candidates[0].content.parts
      ? payload.candidates[0].content.parts
      : [];

  const reply = parts
    .map((part) => (part && part.text ? part.text : ''))
    .join('')
    .trim();

  if (!reply) {
    throw new Error('Empty response from Gemini');
  }

  return reply;
}

async function getSupabaseContext() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data: personalData, error: fetchError } = await supabase
    .from('personal_data')
    .select('key, value');

  if (fetchError) {
    throw new Error(`Supabase fetch error: ${fetchError.message}`);
  }

  return (personalData || [])
    .map((item) => `${item.key}: ${item.value}`)
    .join('\n');
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const message =
      typeof body.message === 'string'
        ? body.message.trim().slice(0, MAX_MESSAGE_LENGTH)
        : '';
    const history = sanitizeHistory(body.history);

    if (!message) {
      return jsonResponse(400, { error: 'Message is required' });
    }

    const contextInfo = await getSupabaseContext();
    const systemPrompt =
      "You are Anthony's personal AI assistant. Use only the provided profile data as factual source. " +
      "Answer naturally, clearly, and helpfully. If information is missing, say you don't have it yet. " +
      "Profile data:\n\n" +
      contextInfo;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message },
    ];

    const catalog = providerCatalog();
    const order = providerOrder();
    const errors = [];

    for (const name of order) {
      const provider = catalog[name];
      if (!provider) {
        continue;
      }

      if (!provider.apiKey || !provider.model) {
        errors.push(`${provider.name}: not configured`);
        continue;
      }

      if (provider.type === 'openai_compatible' && !provider.baseURL && provider.name !== 'openai') {
        errors.push(`${provider.name}: missing base URL`);
        continue;
      }

      try {
        const reply =
          provider.type === 'gemini'
            ? await callGemini(provider, messages, systemPrompt)
            : await callOpenAICompatible(provider, messages);

        return jsonResponse(200, {
          reply,
          provider: provider.name,
        });
      } catch (error) {
        const safeMessage = safeErrorMessage(error);
        console.error(`[chat] ${provider.name} failed: ${safeMessage}`);
        errors.push(`${provider.name}: failed`);
      }
    }

    return jsonResponse(500, {
      error:
        'All configured AI providers failed. Check environment variables and provider models.',
      details: errors,
    });
  } catch (error) {
    const safeMessage = safeErrorMessage(error);
    console.error('[chat] Fatal error:', safeMessage);
    return jsonResponse(500, { error: safeMessage });
  }
};
