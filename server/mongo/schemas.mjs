/** schemas.mjs v1.0.0 — espelha ChamadoN1 + Cliente do Desk */
import mongoose from 'mongoose';
import { getCadastrosConnection } from './connection.mjs';

const ClienteRefSchema = new mongoose.Schema(
  {
    clienteCpf: { type: String, default: '' },
    clienteId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { _id: false },
);

const TabulacaoSchema = new mongoose.Schema(
  {
    tipoChamado: { type: String, default: '' },
    produto: { type: String, default: '' },
    motivo: { type: String, default: '' },
    detalhe: { type: String, default: '' },
    responsavel: { type: String, default: '' },
    atribuido: { type: String, default: '' },
  },
  { _id: false },
);

const RegistroSchema = new mongoose.Schema(
  {
    data: { type: Date, default: Date.now },
    mensagemPublica: { type: String, default: '' },
    anexosMensagemPublica: { type: [String], default: [] },
    anotacaoInterna: { type: String, default: '' },
    anexosAnotacaoInterna: { type: [String], default: [] },
    alteracoes: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, default: 'novo' },
  },
  { _id: false },
);

const ChamadoN1Schema = new mongoose.Schema(
  {
    chamadoProtocolo: { type: String, required: true, unique: true },
    chamadoTitulo: { type: String, default: '' },
    cliente: { type: [ClienteRefSchema], default: [] },
    tabulacao: { type: [TabulacaoSchema], default: [] },
    registro: { type: [RegistroSchema], default: [] },
  },
  {
    timestamps: true,
    collection: 'chamados_n1',
  },
);

const ClienteDadosSchema = new mongoose.Schema(
  {
    clienteCpf: { type: String, default: '' },
    clienteNome: { type: String, default: '' },
    clienteEmail: { lista: { type: [String], default: [] } },
    clienteTelefone: { lista: { type: [String], default: [] } },
  },
  { _id: false },
);

const AtendimentoHistoricoSchema = new mongoose.Schema(
  {
    chamadoProtocolo: { type: String, default: '' },
    resumo: { type: String, default: '' },
    avaliacao: { type: String, default: '' },
  },
  { _id: false },
);

const ClienteSchema = new mongoose.Schema(
  {
    clienteDados: { type: [ClienteDadosSchema], default: [] },
    atendimentoHistorico: { type: [AtendimentoHistoricoSchema], default: [] },
  },
  {
    timestamps: true,
    collection: 'clientes',
  },
);

export function getChamadoModel() {
  if (mongoose.models.ChamadoN1) return mongoose.models.ChamadoN1;
  return mongoose.model('ChamadoN1', ChamadoN1Schema);
}

export function getClienteModel(env = process.env) {
  const conn = getCadastrosConnection(env);
  if (conn.models.Cliente) return conn.models.Cliente;
  return conn.model('Cliente', ClienteSchema);
}
