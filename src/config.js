/** config.js v1.0.1 */
function normalizeBase(url) {
  return String(url || '').replace(/\/$/, '').replace(/\/api$/, '');
}

const envDesk = normalizeBase(import.meta.env.VITE_VELODESK_API_URL);

function isBrowserLocalHost() {
  if (typeof window === 'undefined') return true;
  const { hostname } = window.location;
  return (
    hostname === 'localhost'
    || hostname === '127.0.0.1'
    || /^192\.168\./.test(hostname)
    || /^10\./.test(hostname)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  );
}

/** Vercel/produção: proxy same-origin. LAN/local: API direta. */
export function useVelodeskProxy() {
  return typeof window !== 'undefined' && !isBrowserLocalHost();
}

export function getVelodeskAxiosBase() {
  if (useVelodeskProxy()) return '/api/velodesk';
  return `${envDesk || 'http://localhost:8001'}/api`;
}

export const VELODESK_API_BASE = envDesk || 'http://localhost:8001';

export function getVelodeskDisplayLabel() {
  if (useVelodeskProxy()) {
    return 'API Desk via proxy Vercel (configure VELODESK_API_URL no painel)';
  }
  return VELODESK_API_BASE;
}

export const TOKEN_KEY = 'gerador_velodesk_token';
export const SESSION_KEY = 'gerador_chamados';
