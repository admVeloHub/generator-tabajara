/** vercelUtils.mjs v1.0.0 — helpers para handlers Vercel */
export function setCorsHeaders(res, methods = 'GET, POST, OPTIONS') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export async function parseJsonBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      const trimmed = req.body.trim();
      if (!trimmed) return {};
      try {
        return JSON.parse(trimmed);
      } catch {
        throw new Error('JSON inválido no corpo da requisição');
      }
    }
    return req.body;
  }
  return {};
}

export async function runDeskHandler(req, res, path) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { handleDeskApiRequest } = await import('./deskApi.mjs');
  const body = req.method === 'GET' || req.method === 'HEAD'
    ? undefined
    : await parseJsonBody(req);

  const result = await handleDeskApiRequest({
    method: req.method,
    path,
    query: req.query,
    body,
    env: process.env,
  });

  return res.status(result.status).json(result.body);
}
