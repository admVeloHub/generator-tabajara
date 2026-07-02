/** generate-questions.js v1.0.1 — Vercel serverless Gemini */
import { handleGenerateQuestionsRequest } from '../server/generateQuestions.mjs';
import { parseJsonBody, setCorsHeaders } from '../server/vercelUtils.mjs';

export default async function handler(req, res) {
  setCorsHeaders(res, 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const body = await parseJsonBody(req);
    const result = await handleGenerateQuestionsRequest(body, {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    const status = err.message?.includes('JSON') ? 400 : 500;
    return res.status(status).json({ message: err.message || 'Erro interno' });
  }
}
