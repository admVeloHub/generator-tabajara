/** config.js v1.0.0 */
const raw = import.meta.env.VITE_VELODESK_API_URL || 'http://localhost:8001';
export const VELODESK_API_BASE = raw.replace(/\/$/, '').replace(/\/api$/, '');

export const TOKEN_KEY = 'gerador_velodesk_token';
export const SESSION_KEY = 'gerador_chamados';
