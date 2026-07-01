/** popKnowledge.js v1.0.0 — referência POPs Velotax para geração de perguntas */

export const POP_DOCUMENTS = [
  {
    id: 'POP-Cup-001',
    theme: 'cupons',
    title: 'Cupons — Contratação e Utilização',
    escopo: [
      'Informações gerais sobre Créditos Velotax',
      'Compra de créditos pelo aplicativo (aba Cupons → Comprar Créditos)',
      'Pagamento Pix ou Cartão de Crédito',
      'Prazo de compensação (Pix imediato; cartão conforme prazo)',
      'Créditos por pagamento de parcela do Empréstimo Pessoal (100 créditos por parcela elegível)',
      'Parcela paga antes do vencimento NÃO gera créditos',
      'Validade dos créditos: 6 meses',
      'Resgate de cupons na aba Cupons (parceiro Vibe)',
      'Problemas após resgate → parceiro Vibe 0800 731 2500',
      'Inconsistência na compra ou disponibilização de créditos',
    ],
    perguntasExemplo: [
      'Comprei créditos no Pix mas ainda não apareceram na minha conta.',
      'Paguei a parcela do empréstimo e não recebi os 100 créditos prometidos.',
      'Paguei a parcela antes do vencimento e não ganhei crédito, por quê?',
      'Onde compro créditos Velotax no app?',
      'Meus créditos vão expirar? Quanto tempo tenho para usar?',
      'Tentei resgatar um cupom e deu erro na tela.',
      'Comprei no cartão faz dias e os créditos não caíram.',
      'Como uso os créditos para pegar cupom de desconto?',
      'Resgatei o cupom mas no parceiro não funciona, o que faço?',
    ],
  },
  {
    id: 'POP-EP-001',
    theme: 'epAntecipacao',
    title: 'Empréstimo Pessoal — Contratação',
    escopo: [
      'Etapas da contratação do Empréstimo Pessoal Velotax',
      'Open Finance obrigatório para análise de crédito',
      'Análise automática (até 5 min após Open Finance)',
      'Elegível vs inelegível no CRM',
      'CCB — formalização eletrônica',
      'Crédito na chave Pix CPF (30 min a 24h após confirmação)',
      'Idade 18 a 75 anos; uma contratação ativa por cliente',
      'Nova tentativa após reprovação: 30 dias',
      'Erro ou dificuldade no Open Finance',
      'Proposta, condições, parcelas, desembolso',
    ],
    perguntasExemplo: [
      'Estou tentando contratar o empréstimo mas trava no Open Finance.',
      'Já autorizei o Open Finance e não saiu o resultado da análise.',
      'Apareceu que sou elegível mas não consigo avançar no app.',
      'Assinei a CCB e o dinheiro ainda não caiu na conta.',
      'Quanto tempo demora para o valor ser depositado?',
      'Não entendi as condições da proposta que apareceu.',
      'O app fechou no meio da contratação, perdi tudo?',
      'Preciso compartilhar meus dados bancários? É obrigatório?',
    ],
  },
  {
    id: 'POP-EP-003',
    theme: 'epAntecipacao',
    title: 'Empréstimo Pessoal — Inelegibilidade',
    escopo: [
      'Cliente sem oferta / inelegível / sem margem',
      'Elegibilidade definida automaticamente pelo sistema',
      'Atendente NÃO informa motivo da negativa do CRM ao cliente',
      'Orientar nova tentativa em 30 dias quando aplicável',
      'Inconsistência ou informação incoerente na análise → evidências + requisição suporte',
    ],
    perguntasExemplo: [
      'Por que não consigo contratar o empréstimo? Aparece que não tenho oferta.',
      'O app diz que não sou elegível, o que faço agora?',
      'Fui recusado no empréstimo, quando posso tentar de novo?',
      'Acho que a negativa está errada, tenho renda e conta em dia.',
      'Aparece sem margem mas eu nunca contratei empréstimo com vocês.',
    ],
  },
  {
    id: 'POP-IR26-005',
    theme: 'epAntecipacao',
    title: 'Antecipação IRPF 2026 — Liberação Chave Pix',
    escopo: [
      'Solicitação de liberação/remoção da chave Pix CPF vinculada ao Velobank',
      'Contrato de Antecipação IR 2026 em vigência',
      'Não se aplica a contrato quitado ou inexistente',
      'Pode resultar em quebra contratual — encaminhamento fila 2026 ou Ouvidoria',
      'Solicitação em andamento → aguardar análise',
    ],
    perguntasExemplo: [
      'Quero tirar minha chave Pix CPF do Velobank, como faço?',
      'Preciso liberar a chave Pix que está vinculada à antecipação do IR.',
      'Já pedi liberação da chave Pix e ninguém me retornou.',
      'Quero usar minha chave Pix em outro banco mas está presa aí.',
      'Existe pedido em aberto para liberar minha chave Pix?',
    ],
  },
  {
    id: 'POP-IR26-006',
    theme: 'epAntecipacao',
    title: 'Antecipação IRPF 2026 — Liquidação Antecipada',
    escopo: [
      'Consulta saldo devedor (valores CRM são aproximados)',
      'Cronograma de Pagamentos no app: Início → menu → Documentos → Cronograma de Pagamentos',
      'Liquidação antecipada via Pix ou boleto no cronograma',
      'Descontos proporcionais na liquidação antecipada',
      'Liquidação automática quando cai a restituição da Receita',
      'Carta de Quitação após quitação integral',
      'Cronograma indisponível → evidências + suporte (48h) ou link contingencial cobrança',
      'Chave Pix após quitação → POP portabilidade separado',
    ],
    perguntasExemplo: [
      'Quanto falta pagar para quitar minha antecipação do IR?',
      'Não acho o Cronograma de Pagamentos no aplicativo.',
      'Quero quitar antecipado, como gero o Pix?',
      'Paguei mas o saldo ainda aparece em aberto.',
      'Como solicito a carta de quitação?',
      'A restituição caiu na conta e a operação não quitou sozinha.',
      'O cronograma dá erro toda vez que abro.',
      'Quero pagar hoje com desconto, qual o valor exato?',
    ],
  },
  {
    id: 'POP-IR26-007',
    theme: 'epAntecipacao',
    title: 'Antecipação IRPF 2026 — Encaminhamento Cobrança',
    escopo: [
      'Cliente quer falar com Equipe de Cobrança IR26',
      'Validar status no CRM: ativo/regular vs Quebra Contratual',
      'Contrato ativo e regular → NÃO encaminha cobrança; orientar Cronograma de Pagamentos',
      'Quebra Contratual → Macro Cobrança IR26 com WhatsApp oficial',
      'Central não negocia valores nem faz acordos',
    ],
    perguntasExemplo: [
      'Quero negociar minha dívida da antecipação do IR, fala com cobrança.',
      'Preciso de um desconto para pagar a antecipação, vocês negociam?',
      'Me passa o WhatsApp da cobrança da antecipação.',
      'Estou em quebra contratual e quero acertar o pagamento.',
      'Quero parcelar o que devo da antecipação do imposto de renda.',
    ],
  },
];

export function getDocumentsForTheme(themeId) {
  if (themeId === 'all') return POP_DOCUMENTS;
  return POP_DOCUMENTS.filter((doc) => doc.theme === themeId);
}

export function formatPopContextForPrompt(themeId) {
  const docs = getDocumentsForTheme(themeId);
  return docs.map((doc) => {
    const escopo = doc.escopo.map((s) => `  - ${s}`).join('\n');
    const exemplos = doc.perguntasExemplo.map((s) => `  • "${s}"`).join('\n');
    return `[${doc.id}] ${doc.title}
Escopo / assuntos atendíveis:
${escopo}
Exemplos de dúvidas do cliente (referência de tom e assunto):
${exemplos}`;
  }).join('\n\n');
}

export function getStaticMessagesFromPops(theme, count) {
  const docs = getDocumentsForTheme(theme === 'all' ? 'all' : theme);
  const pool = docs.flatMap((doc) =>
    doc.perguntasExemplo.map((text) => ({ text, themeKey: doc.theme, popId: doc.id })),
  );
  if (pool.length === 0) return [];

  const out = [];
  for (let i = 0; i < count; i += 1) {
    out.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return out;
}
