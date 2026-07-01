/** velodeskProxy.mjs v1.0.0 — proxy server-side para API Desk (dev + Vercel) */
export function resolveVelodeskBackend(env = process.env) {
  const raw = env.VELODESK_API_URL
    || env.VITE_VELODESK_API_URL
    || 'http://localhost:8001';
  return String(raw).replace(/\/$/, '').replace(/\/api$/, '');
}

function buildTargetUrl(backendBase, path, queryString) {
  const cleanPath = String(path || '').replace(/^\//, '');
  const qs = queryString && queryString.startsWith('?') ? queryString : '';
  return `${backendBase}/api/${cleanPath}${qs}`;
}

export async function proxyVelodeskRequest({
  method,
  path,
  queryString = '',
  headers = {},
  body,
  env,
}) {
  const backendBase = resolveVelodeskBackend(env);
  if (!backendBase || (backendBase.includes('localhost') && env.VERCEL)) {
    return {
      status: 503,
      body: {
        message: 'Configure VELODESK_API_URL no Vercel com a URL pública do backend Desk (Cloud Run). localhost não funciona na Vercel.',
      },
    };
  }

  const url = buildTargetUrl(backendBase, path, queryString);
  const forwardHeaders = {
    'Content-Type': headers['content-type'] || headers['Content-Type'] || 'application/json',
  };
  if (headers.authorization || headers.Authorization) {
    forwardHeaders.Authorization = headers.authorization || headers.Authorization;
  }

  const init = {
    method: method || 'GET',
    headers: forwardHeaders,
  };
  if (body && method !== 'GET' && method !== 'HEAD') {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const response = await fetch(url, init);
  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text || response.statusText };
  }

  return { status: response.status, body: json, raw: text };
}

export async function handleVelodeskProxyHttp(req, res, env) {
  const url = new URL(req.url, 'http://localhost');
  const prefix = '/api/velodesk';
  if (!url.pathname.startsWith(prefix)) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Not found' }));
    return;
  }

  const path = url.pathname.slice(prefix.length).replace(/^\//, '');
  const queryString = url.search || '';

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => { data += chunk; });
      req.on('end', () => resolve(data || undefined));
    });
    if (body) {
      try {
        body = JSON.parse(body);
      } catch {
        /* keep string */
      }
    }
  }

  try {
    const result = await proxyVelodeskRequest({
      method: req.method,
      path,
      queryString,
      headers: req.headers,
      body,
      env,
    });
    res.statusCode = result.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result.body));
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: err.message || 'Erro no proxy Velodesk' }));
  }
}
