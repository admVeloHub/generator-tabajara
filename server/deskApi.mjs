/** deskApi.mjs v1.0.0 — API server-side → MongoDB Atlas */
import { ensureMongoConnections } from './mongo/connection.mjs';
import { findClienteByCpf, createCliente } from './mongo/clienteService.mjs';
import { createTicket, getTicketById, appendClientMessage } from './mongo/chamadoService.mjs';

function parseQuery(url) {
  const search = url.includes('?') ? url.slice(url.indexOf('?')) : '';
  return Object.fromEntries(new URLSearchParams(search));
}

async function readBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  if (req.body !== undefined) return req.body;

  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      if (!data) return resolve(undefined);
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve(data);
      }
    });
  });
}

export async function handleDeskApiRequest({ method, path, query = {}, body, env = process.env }) {
  await ensureMongoConnections(env);

  const cleanPath = String(path || '').replace(/^\/+/, '');

  try {
    if (method === 'GET' && cleanPath === 'clients') {
      const cpf = query.cpf;
      if (!cpf) {
        return { status: 400, body: { message: 'Query cpf é obrigatória' } };
      }
      const cliente = await findClienteByCpf(cpf, env);
      if (!cliente) {
        return { status: 404, body: { message: 'Cliente não encontrado' } };
      }
      return { status: 200, body: cliente };
    }

    if (method === 'POST' && cleanPath === 'clients') {
      try {
        const cliente = await createCliente(body, env);
        return { status: 201, body: cliente };
      } catch (err) {
        if (err.status) return { status: err.status, body: { message: err.message } };
        throw err;
      }
    }

    if (method === 'POST' && cleanPath === 'tickets') {
      try {
        const ticket = await createTicket(body || {}, env);
        return { status: 201, body: ticket };
      } catch (err) {
        if (err.status) return { status: err.status, body: { message: err.message } };
        throw err;
      }
    }

    const ticketMatch = cleanPath.match(/^tickets\/([^/]+)$/);
    if (method === 'GET' && ticketMatch) {
      try {
        const ticket = await getTicketById(ticketMatch[1], env);
        return { status: 200, body: ticket };
      } catch (err) {
        if (err.status) return { status: err.status, body: { message: err.message } };
        throw err;
      }
    }

    const messageMatch = cleanPath.match(/^tickets\/([^/]+)\/messages$/);
    if (method === 'POST' && messageMatch) {
      try {
        const ticket = await appendClientMessage(messageMatch[1], body?.text, env);
        return { status: 201, body: ticket };
      } catch (err) {
        if (err.status) return { status: err.status, body: { message: err.message } };
        throw err;
      }
    }

    return { status: 404, body: { message: 'Rota não encontrada' } };
  } catch (err) {
    return {
      status: 500,
      body: { message: err.message || 'Erro interno ao acessar MongoDB' },
    };
  }
}

export async function handleDeskApiHttp(req, res, env = process.env) {
  const url = new URL(req.url, 'http://localhost');
  const prefix = '/api/desk';
  if (!url.pathname.startsWith(prefix)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Not found' }));
    return;
  }

  const path = url.pathname.slice(prefix.length).replace(/^\//, '');
  const query = Object.fromEntries(url.searchParams.entries());
  const body = await readBody(req);

  const result = await handleDeskApiRequest({
    method: req.method,
    path,
    query,
    body,
    env,
  });

  res.statusCode = result.status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result.body));
}
