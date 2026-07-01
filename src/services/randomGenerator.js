/** randomGenerator.js v1.0.0 */
import { generateRandomCpf } from '../utils/cpf.js';

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildClientBody(cpf) {
  return {
    clienteDados: [{
      clienteCpf: cpf,
      clienteNome: 'Cliente Simulação',
      clienteEmail: { lista: [] },
      clienteTelefone: { lista: [] },
    }],
    atendimentoHistorico: [],
  };
}

export function randomCpfForTicket() {
  return generateRandomCpf();
}
