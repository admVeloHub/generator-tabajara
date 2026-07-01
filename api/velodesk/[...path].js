/** api/velodesk/[...path].js v1.0.0 — Vercel proxy → backend Desk */
import { proxyVelodeskRequest } from '../../server/velodeskProxy.mjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const segments = req.query.path;
  const path = Array.isArray(segments) ? segments.join('/') : String(segments || '');

  const query = { ...req.query };
  delete query.path;
  const qs = Object.keys(query).length
    ? `?${new URLSearchParams(query).toString()}`
    : '';

  try {
    const result = await proxyVelodeskRequest({
      method: req.method,
      path,
      queryString: qs,
      headers: req.headers,
      body: req.body,
      env: process.env,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(502).json({ message: err.message || 'Erro no proxy Velodesk' });
  }
}
