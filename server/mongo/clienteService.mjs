/** clienteService.mjs v1.0.0 */
import mongoose from 'mongoose';
import { getClienteModel } from './schemas.mjs';

export function normalizeCpf(value) {
  return String(value ?? '').replace(/\D/g, '');
}

export function getPrimaryDados(cliente) {
  if (!cliente?.clienteDados?.length) return null;
  return cliente.clienteDados[0];
}

export async function findClienteByCpf(cpfRaw, env) {
  const cpf = normalizeCpf(cpfRaw);
  if (!cpf) return null;
  const Cliente = getClienteModel(env);
  return Cliente.findOne({ 'clienteDados.clienteCpf': cpf });
}

export async function findClienteById(id, env) {
  const idStr = String(id ?? '').trim();
  if (!idStr || !mongoose.Types.ObjectId.isValid(idStr)) return null;
  const Cliente = getClienteModel(env);
  return Cliente.findById(idStr);
}

export async function createCliente(body, env) {
  const dados = body?.clienteDados;
  if (!Array.isArray(dados) || dados.length === 0) {
    throw Object.assign(new Error('clienteDados[] é obrigatório'), { status: 400 });
  }

  const cpf = normalizeCpf(dados[0]?.clienteCpf);
  if (cpf) {
    const exists = await findClienteByCpf(cpf, env);
    if (exists) {
      throw Object.assign(new Error('CPF já cadastrado'), { status: 409 });
    }
  }

  const Cliente = getClienteModel(env);
  return Cliente.create({
    clienteDados: dados,
    atendimentoHistorico: Array.isArray(body?.atendimentoHistorico)
      ? body.atendimentoHistorico
      : [],
  });
}

export async function resolveClienteRefFromBody(body, env, existing = null) {
  const lateral = body.lateralForm ?? {};
  const cpfFromBody = normalizeCpf(body.clientCPF ?? lateral.clienteCpf ?? lateral.cpf);
  const clienteIdRaw = body.clienteId;
  const cpf = cpfFromBody || normalizeCpf(existing?.clienteCpf);

  if (!cpf && !clienteIdRaw && !existing?.clienteId) return [];

  let cliente = null;

  if (clienteIdRaw && mongoose.Types.ObjectId.isValid(String(clienteIdRaw))) {
    cliente = await findClienteById(clienteIdRaw, env);
  }

  if (!cliente && cpf) {
    cliente = await findClienteByCpf(cpf, env);
  }

  const hasContactData = body.clientName !== undefined
    || body.clientCPF !== undefined
    || lateral.clienteNome !== undefined
    || lateral.cpf !== undefined;

  if (!cliente && hasContactData && cpf) {
    const Cliente = getClienteModel(env);
    cliente = await Cliente.create({
      clienteDados: [{
        clienteCpf: cpf,
        clienteNome: String(body.clientName ?? lateral.clienteNome ?? 'Cliente Simulação').trim(),
        clienteEmail: { lista: [] },
        clienteTelefone: { lista: [] },
      }],
      atendimentoHistorico: [],
    });
  }

  const resolvedCpf = cpf || normalizeCpf(getPrimaryDados(cliente)?.clienteCpf);
  const resolvedId = cliente?._id ?? existing?.clienteId ?? null;

  if (!resolvedCpf && !resolvedId) return [];

  return [{
    clienteCpf: resolvedCpf,
    clienteId: resolvedId,
  }];
}

export async function loadDadosForRef(ref, env) {
  if (!ref) return null;

  if (ref.clienteId) {
    const byId = await findClienteById(ref.clienteId, env);
    const dados = getPrimaryDados(byId);
    if (dados) return dados;
  }

  if (ref.clienteCpf) {
    const byCpf = await findClienteByCpf(ref.clienteCpf, env);
    return getPrimaryDados(byCpf);
  }

  return null;
}
