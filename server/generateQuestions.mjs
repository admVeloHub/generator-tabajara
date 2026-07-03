/** generateQuestions.mjs v1.0.2 — Gemini server-side (dev + Vercel) */
import { buildPrompt } from '../src/prompts/generateQuestionsPrompt.js';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

function extractJson(text) {
  const raw = String(text || '').trim();
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : raw;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function callGemini({ theme, count, apiKey, model }) {
  if (!apiKey) {
    return { ok: false, status: 503, body: { message: 'GEMINI_API_KEY não configurada' } };
  }

  const prompt = buildPrompt(theme, count);
  const url = `${GEMINI_BASE}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1.3,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    return {
      ok: false,
      status: 502,
      body: { message: `Gemini error: ${response.status}`, detail: errText.slice(0, 300) },
    };
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const parsed = extractJson(text);

  if (!parsed?.messages?.length) {
    return { ok: false, status: 422, body: { message: 'Resposta Gemini inválida ou vazia' } };
  }

  const messages = parsed.messages
    .slice(0, Math.min(count, 20))
    .map((item) => ({ text: String(item?.text || '').trim() }))
    .filter((item) => item.text);

  if (!messages.length) {
    return { ok: false, status: 422, body: { message: 'Nenhuma mensagem válida retornada pelo Gemini' } };
  }

  return {
    ok: true,
    status: 200,
    body: {
      source: 'gemini',
      messages,
    },
  };
}

export async function handleGenerateQuestionsRequest(body, env) {
  const theme = String(body?.theme || 'all').trim();
  const count = Math.min(Math.max(parseInt(body?.count, 10) || 5, 1), 20);
  return callGemini({
    theme,
    count,
    apiKey: env.apiKey,
    model: env.model || 'gemini-2.0-flash',
  });
}
