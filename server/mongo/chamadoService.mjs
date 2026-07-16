/** chamadoService.mjs v1.0.3 — grava chamados_n1 sem chamadoProtocolo (Desk atribui) */
import { getChamadoModel } from './schemas.mjs';
import { loadDadosForRef, resolveClienteRefFromBody } from './clienteService.mjs';
import { isPendingProtocolo, resolvePublicProtocolo } from './protocoloUtils.mjs';

function resolveChamadoTitulo(body, fallback = '') {
  return String(body.chamadoTitulo ?? body.title ?? fallback).trim();
}

function tabulacaoFromBody(body, fallbackTitle = '') {
  const lateral = body.lateralForm ?? {};
  return {
    tipoChamado: lateral.tipoChamado ?? lateral.classificacaoTipo ?? String(body.classificacaoTipo ?? ''),
    produto: lateral.produto ?? String(body.produto ?? ''),
    motivo: lateral.motivo ?? fallbackTitle ?? String(body.title ?? ''),
    detalhe: lateral.detalhe ?? String(body.description ?? ''),
    responsavel: lateral.responsavel ?? String(body.responsibleAgent ?? ''),
    atribuido: lateral.atribuido ?? '',
  };
}

export function currentStatus(chamado) {
  const registros = chamado.registro ?? [];
  if (registros.length === 0) return 'novo';
  return registros[registros.length - 1].status || 'novo';
}

export async function createChamadoFromBody(body, env, status = 'novo') {
  const titulo = resolveChamadoTitulo(body);
  const tab = tabulacaoFromBody(body, titulo);
  const internal = Boolean(body.internal);
  const text = String(body.text ?? body.description ?? '');
  const attachments = Array.isArray(body.attachments)
    ? body.attachments.map((item) => String(item ?? '').trim()).filter(Boolean)
    : [];
  const protocoloInformed = String(body.chamadoProtocolo ?? '').trim();
  const cliente = await resolveClienteRefFromBody(body, env);

  const registro = {
    data: new Date(),
    mensagemPublica: internal ? '' : text,
    anexosMensagemPublica: internal ? [] : attachments,
    anotacaoInterna: internal ? text : '',
    anexosAnotacaoInterna: internal ? attachments : [],
    alteracoes: {},
    status,
  };

  const doc = {
    chamadoTitulo: titulo,
    cliente,
    tabulacao: [tab],
    registro: [registro],
  };

  if (protocoloInformed) {
    doc.chamadoProtocolo = protocoloInformed;
  }

  return doc;
}

export async function chamadoToTicket(chamado, env) {
  const tab = chamado.tabulacao?.[0];
  const ref = chamado.cliente?.[0];
  const status = currentStatus(chamado);

  const cadastro = await loadDadosForRef(ref, env);

  const messages = [];
  chamado.registro?.forEach((reg, index) => {
    if (reg.mensagemPublica) {
      messages.push({
        id: `${index}-pub`,
        text: reg.mensagemPublica,
        sender: reg.alteracoes?.sender === 'me' ? 'me' : 'them',
        type: 'public',
        time: reg.data,
        attachments: reg.anexosMensagemPublica ?? [],
      });
    }
  });

  const titulo = chamado.chamadoTitulo?.trim()
    || tab?.motivo?.trim()
    || 'Chamado sem título';

  const clientCpf = ref?.clienteCpf || cadastro?.clienteCpf;
  const clientName = cadastro?.clienteNome;

  return {
    _id: chamado._id.toString(),
    id: chamado._id.toString(),
    chamadoProtocolo: resolvePublicProtocolo(chamado.chamadoProtocolo),
    chamadoTitulo: titulo,
    title: titulo,
    status,
    clientName,
    clientCPF: clientCpf,
    messages,
    createdAt: chamado.createdAt,
    updatedAt: chamado.updatedAt,
  };
}

export async function createTicket(body, env) {
  const ChamadoN1 = getChamadoModel();
  let status = 'novo';

  if (body.status !== undefined && String(body.status).trim()) {
    status = String(body.status);
  }

  const protocolo = String(body.chamadoProtocolo ?? '').trim();
  if (protocolo && !isPendingProtocolo(protocolo)) {
    const exists = await ChamadoN1.findOne({ chamadoProtocolo: protocolo });
    if (exists) {
      throw Object.assign(new Error('Protocolo já cadastrado'), { status: 409 });
    }
  }

  const payload = await createChamadoFromBody(body, env, status);
  const doc = await ChamadoN1.create(payload);
  return chamadoToTicket(doc, env);
}

export async function getTicketById(id, env) {
  const ChamadoN1 = getChamadoModel();
  const chamado = await ChamadoN1.findById(id);
  if (!chamado) {
    throw Object.assign(new Error('Ticket não encontrado'), { status: 404 });
  }
  return chamadoToTicket(chamado, env);
}

export async function appendClientMessage(ticketId, text, env) {
  const ChamadoN1 = getChamadoModel();
  const chamado = await ChamadoN1.findById(ticketId);
  if (!chamado) {
    throw Object.assign(new Error('Ticket não encontrado'), { status: 404 });
  }

  const status = currentStatus(chamado);
  const msgText = String(text ?? '').trim();
  if (!msgText) {
    throw Object.assign(new Error('Mensagem vazia'), { status: 400 });
  }

  chamado.registro.push({
    data: new Date(),
    mensagemPublica: msgText,
    anexosMensagemPublica: [],
    anotacaoInterna: '',
    anexosAnotacaoInterna: [],
    alteracoes: { sender: 'them' },
    status,
  });

  await chamado.save();
  return chamadoToTicket(chamado, env);
}
