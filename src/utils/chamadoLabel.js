/** chamadoLabel.js v1.0.0 */
export function formatChamadoReferencia({ protocolo, chamadoProtocolo, id } = {}) {
  const proto = String(protocolo || chamadoProtocolo || '').trim();
  if (proto) return proto;

  const ticketId = String(id || '').trim();
  if (!ticketId) return 'Sem protocolo';

  return `#${ticketId.length > 8 ? ticketId.slice(-8) : ticketId}`;
}
