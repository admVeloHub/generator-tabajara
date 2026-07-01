/** api/desk/[...path].js v1.0.0 — Vercel → MongoDB Atlas direto */
import { handleDeskApiRequest } from '../../server/deskApi.mjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const segments = req.query.path;
  const path = Array.isArray(segments) ? segments.join('/') : String(segments || '');

  const query = { ...req.query };
  delete query.path;

  const result = await handleDeskApiRequest({
    method: req.method,
    path,
    query,
    body: req.body,
    env: process.env,
  });

  return res.status(result.status).json(result.body);
}
