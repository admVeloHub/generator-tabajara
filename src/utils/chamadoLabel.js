/** chamadoLabel.js v1.0.1 */
const PENDING_PROTO_PREFIX = '__SIMULACAO_PENDENTE__:';

export function isPendingProtocolo(value) {
  const v = String(value || '').trim();
  return !v || v.startsWith(PENDING_PROTO_PREFIX);
}

export function formatChamadoReferencia({ protocolo, chamadoProtocolo, id } = {}) {
  const proto = String(protocolo || chamadoProtocolo || '').trim();
  if (proto && !isPendingProtocolo(proto)) return proto;

  const ticketId = String(id || '').trim();
  if (!ticketId) return 'Sem protocolo';

  return `#${ticketId.length > 8 ? ticketId.slice(-8) : ticketId}`;
}
