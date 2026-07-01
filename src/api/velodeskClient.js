/** velodeskClient.js v1.0.1 */
import axios from 'axios';
import { VELODESK_API_BASE, TOKEN_KEY } from '../config.js';

const api = axios.create({
  baseURL: `${VELODESK_API_BASE}/api`,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function login(email, password) {
  const { data } = await api.post('/login', { email, password });
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/** 404 = cliente não cadastrado — fluxo normal; em seguida POST /clients */
export async function getClientByCpf(cpf) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await axios.get(`${VELODESK_API_BASE}/api/clients`, {
    params: { cpf },
    timeout: 30000,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
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
