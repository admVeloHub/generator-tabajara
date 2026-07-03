/** TicketDialog.jsx v1.0.1 */
import { useEffect, useState } from 'react';
import { replyAsClient, refreshTicket } from '../services/ticketService.js';
import { getApiErrorMessage } from '../api/velodeskClient.js';
import { formatCpf } from '../utils/cpf.js';
import { formatChamadoReferencia } from '../utils/chamadoLabel.js';

function formatTime(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString('pt-BR');
  } catch {
    return '';
  }
}

export default function TicketDialog({ chamado, onClose, onUpdate }) {
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function loadTicket() {
    if (!chamado?.id) return;
    try {
      const data = await refreshTicket(chamado.id);
      setTicket(data);
      onUpdate?.();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    setError('');
    loadTicket();
  }, [chamado?.id]);

  useEffect(() => {
    if (!chamado?.id) return undefined;
    const timer = setInterval(loadTicket, 5000);
    return () => clearInterval(timer);
  }, [chamado?.id]);

  async function handleReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    setError('');
    try {
      const updated = await replyAsClient(chamado.id, reply.trim());
      setTicket(updated);
      setReply('');
      onUpdate?.();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  if (!chamado) return null;

  const messages = ticket?.messages || [];

  const referencia = formatChamadoReferencia({
    id: chamado.id,
    protocolo: ticket?.chamadoProtocolo || chamado.protocolo,
  });

  return (
    <div className="dialog-overlay" onClick={onClose} role="presentation">
      <div className="dialog" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="dialog-header">
          <div>
            <h3>{referencia}</h3>
            <small>{chamado.titulo}</small>
            {chamado.cpf && (
              <small style={{ display: 'block' }}>CPF: {formatCpf(chamado.cpf)}</small>
            )}
          </div>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>

        <div className="dialog-body">
          {loading && !ticket && <p>Carregando conversa…</p>}
          {error && <div className="alert alert-error">{error}</div>}

          <div className="messages-thread">
            {messages.length === 0 && !loading && (
              <p className="empty-state">Nenhuma mensagem pública ainda.</p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className="msg-bubble msg-client">
                <div>{msg.text}</div>
                <div className="msg-meta">{formatTime(msg.time || msg.timestamp)}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.8rem', opacity: 0.75 }}>
            Status atual: <strong>{ticket?.status || chamado.status}</strong>
            {' · '}
            Atualização automática a cada 5s
          </p>
        </div>

        <div className="dialog-footer">
          <form onSubmit={handleReply}>
            <div className="field" style={{ marginBottom: 8 }}>
              <label htmlFor="reply">Responder como cliente</label>
              <textarea
                id="reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Nova mensagem do cliente simulado…"
                rows={3}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={sending || !reply.trim()}>
              {sending ? 'Enviando…' : 'Enviar mensagem'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
