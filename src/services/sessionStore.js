/** sessionStore.js v1.0.0 */
import { SESSION_KEY } from '../config.js';

function readAll() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(list));
}

export function listChamados() {
  return readAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function addChamado(entry) {
  const list = readAll();
  const item = {
    id: entry.id,
    protocolo: entry.protocolo,
    cpf: entry.cpf,
    titulo: entry.titulo,
    theme: entry.theme || '',
    status: entry.status || 'novo',
    createdAt: entry.createdAt || new Date().toISOString(),
  };
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...item };
  else list.unshift(item);
  writeAll(list);
  return item;
}

export function updateChamadoStatus(id, status) {
  const list = readAll();
  const idx = list.findIndex((x) => x.id === id);
  if (idx >= 0) {
    list[idx].status = status;
    writeAll(list);
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
