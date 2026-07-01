/** velodeskClient.js v1.1.0 — cliente HTTP → /api/desk (MongoDB direto) */
import axios from 'axios';
import { getDeskApiBase } from '../config.js';

const api = axios.create({
  baseURL: getDeskApiBase(),
  timeout: 30000,
});

/** 404 = cliente não cadastrado — fluxo normal; em seguida POST /clients */
export async function getClientByCpf(cpf) {
  const response = await axios.get(`${getDeskApiBase()}/clients`, {
    params: { cpf },
    timeout: 30000,
    validateStatus: (status) => status === 200 || status === 404,
  });
  if (response.status === 404) return null;
  return response.data;
}

export async function createClient(body) {
  const { data } = await api.post('/clients', body);
  return data;
}

export async function createTicket(payload) {
  const { data } = await api.post('/tickets', payload);
  return data;
}

export async function getTicket(id) {
  const { data } = await api.get(`/tickets/${id}`);
  return data;
}

export async function sendClientMessage(ticketId, text) {
  const { data } = await api.post(`/tickets/${ticketId}/messages`, {
    text,
    sender: 'them',
    internal: false,
  });
  return data;
}

export function getApiErrorMessage(err) {
  return err.response?.data?.message || err.message || 'Erro desconhecido';
}
