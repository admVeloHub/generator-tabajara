/** protocoloUtils.mjs v1.0.0 — marcador interno para índice unique do Atlas */
import mongoose from 'mongoose';

export const PENDING_PROTO_PREFIX = '__SIMULACAO_PENDENTE__:';

export function buildPendingProtocolo(objectId = new mongoose.Types.ObjectId()) {
  return `${PENDING_PROTO_PREFIX}${objectId.toString()}`;
}

export function isPendingProtocolo(value) {
  const v = String(value || '').trim();
  return !v || v.startsWith(PENDING_PROTO_PREFIX);
}

export function resolvePublicProtocolo(value) {
  return isPendingProtocolo(value) ? '' : String(value || '').trim();
}
