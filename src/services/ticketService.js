/** ticketService.js v1.0.3 */
import {
  createClient,
  createTicket,
  getClientByCpf,
  getTicket,
  sendClientMessage,
  getApiErrorMessage,
} from '../api/velodeskClient.js';
import { addChamado, updateChamadoStatus } from './sessionStore.js';
import { buildClientBody } from './randomGenerator.js';
import { buildTicketPayload } from '../utils/payload.js';
import { normalizeCpf } from '../utils/cpf.js';

function mapClientRecord(client, cpfFallback) {
  const dados = client?.clienteDados?.[0] || {};
  return {
    clienteId: client._id || client.id,
    clientName: dados.clienteNome || 'Cliente Simulação',
    cpf: normalizeCpf(dados.clienteCpf || cpfFallback),
  };
}

export async function ensureClient(cpf) {
  const digits = normalizeCpf(cpf);
  if (!digits) {
    throw new Error('Informe o CPF.');
  }

  try {
    const created = await createClient(buildClientBody(digits));
    return mapClientRecord(created, digits);
  } catch (err) {
    if (err.response?.status === 409) {
      const existing = await getClientByCpf(digits);
      if (existing) return mapClientRecord(existing, digits);
    }
    throw new Error(getApiErrorMessage(err));
  }
}
export async function createSimulatedTicket({
  cpf,
  message,
  attachments = [],
  themeLabel = 'Manual',
}) {
  const client = await ensureClient(cpf);
  const payload = buildTicketPayload({
    cpf: client.cpf,
    message,
    attachments,
    themeLabel,
    clienteId: client.clienteId,
    clientName: client.clientName,
  });

  const ticket = await createTicket(payload);
  const entry = addChamado({
    id: ticket._id || ticket.id,
    protocolo: ticket.chamadoProtocolo,
    cpf: client.cpf,
    titulo: ticket.chamadoTitulo || ticket.title,
    theme: themeLabel,
    status: ticket.status || 'novo',
  });

  return { ticket, entry };
}

export async function refreshTicket(id) {
  const ticket = await getTicket(id);
  updateChamadoStatus(id, ticket.status || 'novo');
  return ticket;
}

export async function replyAsClient(ticketId, text) {
  const msg = String(text || '').trim();
  if (!msg) throw new Error('Mensagem vazia');
  await sendClientMessage(ticketId, msg);
  return refreshTicket(ticketId);
}
