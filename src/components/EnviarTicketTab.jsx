/** EnviarTicketTab.jsx v1.0.2 */
import { useState } from 'react';
import { createSimulatedTicket } from '../services/ticketService.js';
import { getApiErrorMessage } from '../api/velodeskClient.js';
import { parseAttachmentUrls } from '../utils/payload.js';
import { formatCpf, normalizeCpf } from '../utils/cpf.js';

export default function EnviarTicketTab({ onCreated }) {
  const [cpf, setCpf] = useState('');
  const [message, setMessage] = useState('');
  const [attachmentsRaw, setAttachmentsRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const digits = normalizeCpf(cpf);
    if (!digits) {
      setFeedback({ type: 'error', text: 'Informe o CPF.' });
      return;
    }
    if (!message.trim()) {
      setFeedback({ type: 'error', text: 'Informe a mensagem inicial.' });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const { ticket, entry } = await createSimulatedTicket({
        cpf: digits,
        message: message.trim(),
        attachments: parseAttachmentUrls(attachmentsRaw),
        themeLabel: 'Manual',
      });
      setFeedback({
        type: 'success',
        text: `Chamado criado: ${ticket.chamadoProtocolo}`,
      });
      setMessage('');
      onCreated?.(entry);
    } catch (err) {
      setFeedback({ type: 'error', text: getApiErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel">
      <h2>Enviar ticket</h2>
      <p style={{ fontSize: '0.85rem', marginTop: 0, marginBottom: 16 }}>
        Status fixo: <strong>novo</strong>. Campos mapeados para cliente CPF e mensagem pública inicial.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="cpf">CPF do cliente</label>
          <input
            id="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
          />
          {normalizeCpf(cpf) && (
            <small style={{ opacity: 0.7 }}>{formatCpf(cpf)}</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="message">Mensagem inicial (mensagemPublica)</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Descreva o problema do cliente…"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="attachments">Anexos — URLs (opcional, um por linha)</label>
          <textarea
            id="attachments"
            value={attachmentsRaw}
            onChange={(e) => setAttachmentsRaw(e.target.value)}
            placeholder="https://…"
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Enviando…' : 'Criar chamado'}
        </button>
      </form>
      {feedback && (
        <div className={`alert alert-${feedback.type === 'success' ? 'success' : 'error'}`}>
          {feedback.text}
        </div>
      )}
    </div>
  );
}
