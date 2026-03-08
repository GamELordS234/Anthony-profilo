# Multi AI Provider Setup

This project now supports multiple AI providers with fallback using the same Supabase profile data.

## How It Works

- `netlify/functions/chat.js` builds one shared context from your `personal_data` table.
- The same context is sent to the providers in order.
- If provider 1 fails, it automatically falls back to the next one.
- `chat.js` sends short conversation history so replies stay consistent.

## Required Variables

Always set these:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `ADMIN_PASSWORD`

## Provider Order

Set this in Netlify to control fallback order:

- `AI_PROVIDER_ORDER=openai,groq,gemini,deepseek,github,apifree,openexo`

You can remove providers you do not use.

## OpenAI

- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional, default: `gpt-3.5-turbo`)
- `OPENAI_BASE_URL` (optional, only if using a custom gateway)

## Groq

- `GROQ_API_KEY`
- `GROQ_MODEL` (optional, default: `llama-3.1-8b-instant`)
- `GROQ_BASE_URL` (optional, default: `https://api.groq.com/openai/v1`)

## Gemini

- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional, default: `gemini-1.5-flash`)
- `GEMINI_BASE_URL` (optional, default: `https://generativelanguage.googleapis.com/v1beta`)

## DeepSeek

- `DEEPSEEK_API_KEY`
- `DEEPSEEK_MODEL` (optional, default: `deepseek-chat`)
- `DEEPSEEK_BASE_URL` (optional, default: `https://api.deepseek.com/v1`)

## GitHub Models

- `GITHUB_MODELS_API_KEY`
- `GITHUB_MODELS_MODEL` (optional, default: `gpt-4o-mini`)
- `GITHUB_MODELS_BASE_URL` (optional, default: `https://models.inference.ai.azure.com`)

## APIFREE (OpenAI-Compatible)

- `APIFREE_API_KEY`
- `APIFREE_MODEL` (recommended)
- `APIFREE_BASE_URL` (required)

## OpenExo (OpenAI-Compatible)

- `OPENEXO_API_KEY`
- `OPENEXO_MODEL` (recommended)
- `OPENEXO_BASE_URL` (required)

## Optional Tuning

- `AI_MAX_TOKENS` (default: `250`)

## Deploy Steps

1. Add/update variables in Netlify.
2. Trigger a new deploy.
3. Test chat on your live site.
4. If one provider fails, check Netlify Function logs.

## Security Rules

- Never put API keys in code, markdown files, or git commits.
- Rotate any key that has ever been exposed.
- Keep using the pre-commit hook in `.githooks/pre-commit`.
