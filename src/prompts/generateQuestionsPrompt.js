/** generateQuestionsPrompt.js v1.0.1 — prompt Gemini baseado nos POPs + variação de tom */
import { THEME_OPTIONS } from '../data/simulationScenarios.js';
import { formatPopContextForPrompt } from '../data/popKnowledge.js';

export function buildPrompt(theme, count) {
  const themeOption = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];
  const themeLabel = themeOption?.label || 'Todos';
  const popContext = formatPopContextForPrompt(theme);

  return `Você gera mensagens de clientes brasileiros abrindo chamados de suporte na plataforma Velotax

Sua ÚNICA fonte de assuntos são os POPs (Procedimentos Operacionais Padrão) abaixo. Mantenha fidelidade total aos temas, regras e vocabulário desses documentos. Não invente produtos, fluxos ou políticas que não estejam nos POPs.

TEMA SELECIONADO: ${themeLabel}
QUANTIDADE: ${count} mensagens

=== REFERÊNCIA OBRIGATÓRIA — POPs ===

${popContext}

=== VARIAÇÃO DE TOM (OBRIGATÓRIO) ===

Distribua as ${count} mensagens em diferentes níveis de intensidade emocional. NÃO repita o mesmo tom em todas. Atente-se a não esquecer de incluir realisticamente os niveis. 

Nível 1 — Neutro / simples: dúvida objetiva, tom calmo, pergunta direta.
Nível 2 — Preocupado: ansiedade moderada, insiste no prazo, pede retorno.
Nível 3 — Atritado: irritação clara, impaciência, cobrança repetida, compara com promessas não cumpridas.
Nível 4 — Reclamação veemente: tom agressivo, indignação, acusa descaso ou incompetência (sem xingamentos graves ou hate speech).
Nível 5 — Escalada formal: ameaça de Procon, Ouvidoria, Reclame Aqui, advogado, processo judicial ou "vou acionar meus direitos" — sempre ligada ao problema do POP, de forma plausível.

Regras de tom:
- Varie comprimento e estilo (frases curtas vs. desabafo longo). Use de recursos linguistios diferentes, simule diversas formas de comunicação e estilos de linguagem para gerar realidade. 
- Mesmo nos níveis altos, o problema concreto deve vir de um assunto real dos POPs.
- Ameaças legais são bem-vindas em parte das mensagens; não em todas.
- Proibido: palavrões pesados, discriminação, violência, conteúdo ilegal.

=== REGRAS DE GERAÇÃO ===

1. PT-BR coloquial e natural; soa como mensagem real de cliente (WhatsApp, e-mail ou portal).
2. Cada mensagem: 4 a 8 frases; 1 a 5 assuntos principais de UM POP.
3. NÃO invente CPF, telefone, e-mail, nomes próprios ou valores monetários exatos.
4. NÃO inclua tabulação, motivo, produto, canal ou metadados — apenas o texto da mensagem.
5. Varie os assuntos; se tema "Todos", misture Cupons e EP/Antecipação IR proporcionalmente.
6. Use termos dos POPs quando natural: Open Finance, CCB, Cronograma de Pagamentos, Créditos Velotax, chave Pix CPF, antecipação IRPF 2026, Empréstimo Pessoal, parceiro Vibe, etc.
7. Não simule respostas do atendente — só a fala inicial do cliente.

=== FORMATO DE RESPOSTA ===

Responda SOMENTE JSON válido, sem markdown:
{"messages":[{"text":"mensagem do cliente aqui"}]}

Gere exatamente ${count} objetos no array messages, com tons claramente distintos entre si.`;
}
