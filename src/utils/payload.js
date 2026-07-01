/** payload.js v1.0.2 — CPF + mensagem; tabulação sempre vazia (bloqueia fallbacks do backend) */
import { normalizeCpf } from './cpf.js';

export function buildTicketPayload({
  cpf,
  message,
  attachments = [],
  themeLabel = 'Manual',
  clienteId,
  clientName,
}) {
  const clientCPF = normalizeCpf(cpf);
  const text = String(message || '').trim();
  const title = `[SIMULACAO] ${themeLabel} — ${clientCPF}`;

  return {
    chamadoTitulo: title,
    title,
    text,
    status: 'novo',
    internal: false,
    attachments: attachments.filter(Boolean),
    clienteId,
    clientName: clientName || 'Cliente Simulação',
    clientCPF,
    lateralForm: {
      cpf: clientCPF,
      clienteCpf: clientCPF,
      clienteNome: clientName || 'Cliente Simulação',
      tipoChamado: '',
      classificacaoTipo: '',
      produto: '',
      motivo: '',
      detalhe: '',
      responsavel: '',
      atribuido: '',
    },
  };
}

export function parseAttachmentUrls(raw) {
  return String(raw || '')
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}
