/** generate-questions.js v1.0.0 — Vercel serverless Gemini */
import { handleGenerateQuestionsRequest } from '../server/generateQuestions.mjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await handleGenerateQuestionsRequest(req.body || {}, {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Erro interno' });
  }
}
